/**
 * Created by COD on 25.06.15.
 */

/**
 * A template based view
 *
 * @implements EventListener
 * @implements IrLib.View.Interface
 * @implements IrLib.View.ContextInterface
 * @implements IrLib.View.SubViewInterface
 */
IrLib.View.Template = IrLib.View.AbstractDomView.extend({
    needs: ['serviceLocator'],

    /**
     * @type {IrLib.ServiceLocator}
     */
    serviceLocator: null,

    /**
     * Template to render
     *
     * @type {string}
     */
    _template: '',

    /**
     * Array of parse template blocks
     *
     * @type {IrLib.View.Parser.Block[]}
     */
    _templateBlocks: null,

    /**
     * Dictionary of computed variables
     *
     * @type {IrLib.Dictionary}
     */
    _computed: null,

    /**
     * Template parser instance
     *
     * @type {IrLib.View.Parser.Interface}
     */
    _templateParser: null,

    /**
     * Stack of last condition results
     *
     * @type {Boolean[]}
     */
    _lastConditionStateStack: [],

    /**
     * Registered sub views
     *
     * @type {IrLib.Dictionary}
     */
    _subviewPlaceholders: null,

    /**
     * Render the subviews as string
     * @type {Boolean}
     */
    _renderSubviewsAsPlaceholders: false,

    constructor(template, variables) {
        this._super(template, variables);

        if (arguments.length > 0) { // Check if the template argument is given
            if (typeof template !== 'string') {
                throw new TypeError('Argument "template" is not of type string');
            }
            this.setTemplate(template);
        } else if (typeof this.template === 'string') { // Check if a template string is inherited
            this.setTemplate(this.template.slice(0));
        }

        if (typeof this.computed === 'object') { // Check if a computed variables are inherited
            this.setComputed(this.computed);
        }

        this._subviewPlaceholders = new IrLib.Dictionary();

        if (arguments.length > 1) {
            this.setVariables(variables);
        }

        this.defineProperties({
            'template': {
                enumerable: true,
                get: this.getTemplate,
                set: this.setTemplate
            },
            'computed': {
                enumerable: true,
                get: this.getComputed,
                set: this.setComputed
            }
        });
    },

    /**
     * Returns the string representation of the rendered template
     *
     * @returns {string}
     */
    toString() {
        return this._renderBlocks();
    },

    /**
     * Renders the template
     *
     * @return {Node|HTMLElement}
     */
    render() {
        if (this._needsRedraw) {
            delete this._dom;
            var _template = this.template;
            if (!_template) {
                throw new ReferenceError('Template not specified');
            }

            this._renderSubviewsAsPlaceholders = true;
            this._dom = this._createDom(this.toString());
            this._renderSubviewsAsPlaceholders = false;
            this._needsRedraw = false;
        }
        return this._dom;
    },

    /**
     * Replace the variables inside the given template
     *
     * @returns {string}
     */
    _renderBlocks() {
        var BlockType = IrLib.View.Parser.BlockType,
            State = IrLib.View.State,
            templateBlocks = this.getTemplateBlocks(),
            templateBlocksLength = templateBlocks.length,
            inline_escapeHtml = this._escapeHtml,
            inline_resolveVariable = this._resolveVariable.bind(this),
            inline_renderExpression = this._renderExpression.bind(this),
            renderedTemplate = '',
            currentVariableValue, currentMeta, currentTemplateBlock, index;

        for (index = 0; index < templateBlocksLength; index++) {
            /** @var {IrLib.View.Parser.Block} currentTemplateBlock */
            currentTemplateBlock = templateBlocks[index];
            switch (currentTemplateBlock.type) {
                case BlockType.VARIABLE:
                    currentVariableValue = inline_resolveVariable(currentTemplateBlock.content);
                    currentMeta = currentTemplateBlock.meta;
                    if (!currentMeta.isSafe) {
                        currentVariableValue = inline_escapeHtml(currentVariableValue);
                    }

                    renderedTemplate += currentVariableValue;
                    break;

                case BlockType.EXPRESSION:
                    var state = new State(index, templateBlocks);
                    renderedTemplate += inline_renderExpression(currentTemplateBlock, state);
                    index = state.index;
                    break;

                case BlockType.STATIC:
                /* falls through */
                default:
                    renderedTemplate += currentTemplateBlock.content;
                    break;

            }
        }

        return renderedTemplate;
    },

    /**
     * Renders the expression of the current block
     *
     * @param {IrLib.View.Parser.Block} block
     * @param {IrLib.View.State} state
     * @returns {string}
     * @private
     */
    _renderExpression(block, state) {
        var ExpressionType = IrLib.View.Parser.ExpressionType,
            expressionParts = block.content.split(' '),
            lastConditionStateStack = this._lastConditionStateStack,
            meta = block.meta,
            output, view, viewId;

        switch (meta.expressionType) {
            case ExpressionType.VIEW:
                view = this._resolveView(expressionParts[1]);
                view.setContext(this);
                view.setVariables(this.variables);

                if (this._renderSubviewsAsPlaceholders) {
                    // TODO: Handle insertion of the same views again
                    viewId = 'irLibView-' + view.guid();
                    //console.log(view.guid());
                    this._subviewPlaceholders[viewId] = view;
                    output = '<script id="' + viewId + '" type="text/x-placeholder"></script>';
                } else {
                    output = view.toString();
                }
                break;

            case ExpressionType.ELSE:
                if (lastConditionStateStack.pop() === true) {
                    /* Skip forward to the closing block */
                    state.index++;
                    this._scanToEndExpression(ExpressionType.CONDITIONAL_START, ExpressionType.CONDITIONAL_END, state);
                }
                output = '';
                break;

            case ExpressionType.CONDITIONAL_START:
                if (expressionParts.length < 2) {
                    throw new ReferenceError('Condition missing');
                }
                var conditionKey = expressionParts[1],
                    conditionValue = this._resolveVariable(conditionKey);

                if (this._evaluateConditionValue(conditionValue)) {
                    /* Continue rendering the next blocks */
                    lastConditionStateStack.push(true);
                } else {
                    /* Skip forward to the closing or else block */
                    state.index++;
                    this._scanToEndExpression(ExpressionType.CONDITIONAL_START, ExpressionType.CONDITIONAL_END, state);
                    lastConditionStateStack.push(false);
                }
                output = '';
                break;

            case ExpressionType.CONDITIONAL_END:
                output = '';
                //output = ' eni ';
                break;

            case ExpressionType.UNKNOWN:
            /* falls through */
            default:
                output = '{%' + block.content + '%}';
        }

        return output;
    },

    /**
     * Evaluate the condition value
     *
     * @param {*} conditionValue
     * @returns {boolean}
     * @private
     */
    _evaluateConditionValue(conditionValue) {
        return (
            (Array.isArray(conditionValue) && conditionValue.length > 0) ||
            (typeof conditionValue === 'object' && Object.keys(conditionValue).length > 0) || !!conditionValue
        );
    },

    /**
     * Skip forward to the matching end block
     *
     * @param {IrLib.View.Parser.ExpressionType|string} startExpression
     * @param {IrLib.View.Parser.ExpressionType|string} endExpression
     * @param {IrLib.View.State} state
     * @private
     */
    _scanToEndExpression(startExpression, endExpression, state) {
        var blockStream = state.blockStream,
            blockStreamLength = blockStream.length,
            EXPRESSION = IrLib.View.Parser.BlockType.EXPRESSION,
            EXPRESSION_TYPE_ELSE = IrLib.View.Parser.ExpressionType.ELSE,
            nestingDepth = 1,
            i = state.index,
            balanced = false,
            block, expressionType;

        for (; i < blockStreamLength; i++) {
            /** @type {IrLib.View.Parser.Block} */
            block = blockStream[i];
            if (block.type === EXPRESSION) {
                expressionType = block.meta.expressionType;
                if (expressionType === startExpression) { // Start of a new if/for
                    nestingDepth++;
                } else if (expressionType === endExpression) { // End of the last if/for
                    nestingDepth--;
                    if (nestingDepth < 1) {
                        balanced = true;
                        break;
                    }
                } else if (nestingDepth === 1 && expressionType === EXPRESSION_TYPE_ELSE) { // Matching else was found
                    balanced = true;
                    break;
                }
            }
        }

        if (!balanced) {
            IrLib.Logger.log('Not balanced');
        }
        state.index = i;
    },

    /**
     * Resolve the variable for the given key path
     *
     * @param {string} keyPath
     * @returns {*}
     * @private
     */
    _resolveVariable(keyPath) {
        var result;
        try {
            result = IrLib.Utility.GeneralUtility.valueForKeyPathOfObject(keyPath, this.getVariables(), false);
            if (typeof result === 'function') {
                result = result(this);
            }
        } catch (error) {
            if (!(error instanceof TypeError)) {
                throw error;
            }
        }

        if (!result && keyPath.indexOf('.') === -1) { // Key paths for computed variables must NOT contain a dot
            result = this._resolveAndEvaluateComputed(keyPath);
        }

        return result !== undefined ? result : '';
    },

    /**
     * Resolve the variable for the given key path
     *
     * @param {string} key
     * @returns {*}
     * @private
     */
    _resolveAndEvaluateComputed(key) {
        var _computed = this.computed,
            registeredComputed;
        if (!_computed) {
            return undefined;
        }
        registeredComputed = _computed[key];
        if (typeof registeredComputed === 'function') {
            return registeredComputed.call(this);
        }
        return undefined;
    },

    /**
     * Resolve the requested View
     *
     * @param {string} viewIdentifier
     * @returns {IrLib.View.SubViewInterface}
     * @private
     */
    _resolveView(viewIdentifier) {
        var _serviceLocator = this.serviceLocator,
            view;

        if (!_serviceLocator) {
            throw new ReferenceError('Service Locator must be set to resolve views for identifier "' + viewIdentifier + '"');
        }
        try {
            view = this.serviceLocator.get(viewIdentifier);
        } catch (exception) {
        }
        if (view instanceof IrLib.View.Interface) {
            return view;
        }
        throw new ReferenceError('No view for identifier "' + viewIdentifier + '"');
    },

    /**
     * Escapes the given input
     *
     * @param {string} string
     * @returns {string}
     * @private
     */
    _escapeHtml(string) {
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return String(string).replace(/[&<>"'\/]/g, function fromEntityMap(s) {
            return entityMap[s];
        });
    },

    ///**
    // * Renders the actions inside the given template
    // *
    // * @param {string} template
    // * @returns {string}
    // */
    //_renderActions(template) {
    //    var actionRegularExpression = /\s\{\{action:([\w\-]*)}}\s/g,
    //        _document = $(document),
    //        matches = [], found, i, _this;
    //
    //    /**
    //    * @type {Iresults.Modal}
    //    * @private
    //    */
    //    _this = this;
    //
    //    while (found = actionRegularExpression.exec(template)) {
    //        matches.push({
    //            expression: found[0],
    //            action: found[1]
    //        });
    //        actionRegularExpression.lastIndex -= found[0].split(':')[1].length;
    //    }
    //
    //    for (i = 0; i < matches.length; i++) {
    //        var elementId = Iresults.Modal.actionElementIds.length,
    //            actionDefinition = matches[i],
    //            actionName = actionDefinition.action,
    //            expression = actionDefinition.expression,
    //            elementIdString = 'ir-modal-' + elementId,
    //            elementIdAttribute = ' id="' + elementIdString + '" ',
    //            data
    //            ;
    //        Iresults.Modal.actionElementIds.push(elementId);
    //
    //        data = {
    //            action: actionName
    //        };
    //
    //        /* Prepare the template */
    //        template = template.replace(expression, elementIdAttribute);
    //
    //        /* Register the click handler */
    //        _document.on('click', '#' + elementIdString, data, function(event) {
    //            var actionName = event.data.action,
    //                imp = _this.controller.actions ? _this.controller.actions[actionName] : _this.controller[actionName];
    //
    //            if (!imp) {
    //                throw new Iresults.ActionError('No implementation for method "' + actionName + '"');
    //            }
    //            imp.call(_this.controller, event);
    //        });
    //    }
    //
    //    return template;
    //},

    /**
     * Replace the placeholders for subviews with the actual view instances
     */
    replaceSubviewPlaceholders() {
        var _dom = this._dom;

        this._subviewPlaceholders.forEach(function (view, elementId) {
            var placeholder = _dom.querySelector('#' + elementId);

            //console.log(placeholder, elementId, view.render());

            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.replaceChild(view.render(), placeholder);
                view.addStoredEventListeners();
            } else {
                throw new ReferenceError(
                    'Could not find subview placeholder #' + elementId
                );
            }
        });
        this._subviewPlaceholders = new IrLib.Dictionary();
    },

    /**
     * @inheritDoc
     */
    appendTo(element) {
        this._super(element);
        this.replaceSubviewPlaceholders();
    },

    /**
     * Sets the registered computed variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @returns {IrLib.View.Interface}
     */
    setComputed(data) {
        if (typeof data !== 'object') {
            throw new TypeError('Initialization argument has to be of type object, ' + (typeof data) + ' given');
        }
        if (data instanceof IrLib.Dictionary) {
            this._computed = data;
        } else {
            this._computed = new IrLib.Dictionary(data);
        }
        this._needsRedraw = true;
        return this;
    },

    /**
     * Returns the registered computed variables
     *
     * @returns {IrLib.Dictionary}
     */
    getComputed() {
        return this._computed;
    },

    /**
     * Sets the template
     *
     * @param {string} template
     * @returns {IrLib.View.Template}
     */
    setTemplate(template) {
        var templateTemporary = template.trim();
        if (this._isSelector(templateTemporary)) {
            this._template = this._getTemplateForSelector(templateTemporary);
        } else {
            this._template = templateTemporary;
        }
        this._needsRedraw = true;
        this._templateBlocks = null;
        return this;
    },

    /**
     * Returns the template
     *
     * @returns {string}
     */
    getTemplate() {
        return this._template;
    },

    /**
     * Returns the template blocks
     *
     * @returns {IrLib.View.Parser.Block[]}
     */
    getTemplateBlocks() {
        if (!this._templateBlocks) {
            var templateParser = this.getTemplateParser();
            this._templateBlocks = templateParser.parse(this._template);
        }
        return this._templateBlocks;
    },

    /**
     * Returns if the given value is a selector
     *
     * @param {*} value
     * @returns {boolean}
     * @private
     */
    _isSelector(value) {
        if (typeof value !== 'string') {
            return false;
        }
        if (value.indexOf('<') !== -1 || value.indexOf('{') !== -1) {
            return false;
        }
        var firstChar = value.charAt(0);
        return firstChar === '#' || firstChar === '.' || /^[a-z]/i.test(firstChar);
    },

    /**
     * Returns the template for the given selector
     *
     * @param {string} selector
     * @returns {string}
     * @private
     */
    _getTemplateForSelector(selector) {
        var templateElement = document.querySelector(selector),
            templateHtml;
        if (!templateElement) {
            return null;
        }
        templateHtml = templateElement.innerHTML;
        return templateHtml ? templateHtml.trim() : null;
    },

    /**
     * Returns the template parser interface
     *
     * @returns {IrLib.View.Parser.Interface}
     */
    getTemplateParser() {
        if (!this._templateParser) {
            this._templateParser = new IrLib.View.Parser.Parser();
        }
        return this._templateParser;
    },

    /**
     * Returns a clone of this object
     *
     * @returns {*}
     */
    clone() {
        var _clone = this._super();
        _clone._subviewPlaceholders = new IrLib.Dictionary();
        _clone._lastConditionStateStack = [];
        return _clone;
    }
});
