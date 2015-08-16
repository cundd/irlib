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
     * @type {String}
     */
    _template: '',

    /**
     * Array of parse template blocks
     *
     * @type {IrLib.View.Parser.Block[]}
     */
    _templateBlocks: null,

    /**
     * Dictionary of template variables
     *
     * @type {IrLib.Dictionary}
     */
    _variables: null,

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

    init: function (template, variables) {
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

        this.setVariables(variables || {});
        this.defineProperties({
            'template': {
                enumerable: true,
                get: this.getTemplate,
                set: this.setTemplate
            },
            'needsRedraw': {
                enumerable: true,
                get: this.getNeedsRedraw
            },
            'variables': {
                enumerable: true,
                get: this.getVariables,
                set: this.setVariables
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
     * @returns {String}
     */
    toString: function () {
        return this._renderBlocks();
    },

    /**
     * Replace the variables inside the given template
     *
     * @returns {String}
     */
    _renderBlocks: function () {
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
     * @returns {String}
     * @private
     */
    _renderExpression: function (block, state) {
        var ExpressionType = IrLib.View.Parser.ExpressionType,
            expressionParts = block.content.split(' '),
            lastConditionStateStack = this._lastConditionStateStack,
            meta = block.meta,
            output, view;

        switch (meta.expressionType) {
            case ExpressionType.VIEW:
                view = this._resolveView(expressionParts[1]);
                view.setContext(this);
                view.setVariables(this.variables);

                output = view.toString();
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
                output = '';
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
    _evaluateConditionValue: function (conditionValue) {
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
    _scanToEndExpression: function (startExpression, endExpression, state) {
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
     * @param {String} keyPath
     * @returns {*}
     * @private
     */
    _resolveVariable: function (keyPath) {
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
     * @param {String} key
     * @returns {*}
     * @private
     */
    _resolveAndEvaluateComputed: function (key) {
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
     * @param {String} viewIdentifier
     * @returns {IrLib.View.SubViewInterface}
     * @private
     */
    _resolveView: function (viewIdentifier) {
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
     * @param {String} string
     * @returns {string}
     * @private
     */
    _escapeHtml: function (string) {
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
    // * @param {String} template
    // * @returns {String}
    // */
    //_renderActions: function (template) {
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
     * Sets the variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @returns {IrLib.View.Interface}
     */
    setVariables: function (data) {
        if (typeof data !== 'object') {
            throw new TypeError('Initialization argument has to be of type object, ' + (typeof data) + ' given');
        }
        if (data instanceof IrLib.Dictionary) {
            this._variables = data;
        } else {
            this._variables = new IrLib.Dictionary(data);
        }
        this._needsRedraw = true;
        return this;
    },

    /**
     * Adds the variable with the given key and value
     *
     * @param {String} key
     * @param {*} value
     * @returns {IrLib.View.Interface}
     */
    assignVariable: function (key, value) {
        this._variables[key] = value;
        this._needsRedraw = true;
        return this;
    },

    /**
     * Returns the currently assigned variables
     *
     * @returns {IrLib.Dictionary}
     */
    getVariables: function () {
        return this._variables;
    },

    /**
     * Sets the registered computed variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @returns {IrLib.View.Interface}
     */
    setComputed: function (data) {
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
    getComputed: function() {
        return this._computed;
    },

    /**
     * Sets the template
     *
     * @param {String} template
     * @returns {IrLib.View.Template}
     */
    setTemplate: function (template) {
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
     * @returns {String}
     */
    getTemplate: function () {
        return this._template;
    },

    /**
     * Returns the template blocks
     *
     * @returns {IrLib.View.Parser.Block[]}
     */
    getTemplateBlocks: function () {
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
    _isSelector: function (value) {
        if (typeof value !== 'string') {
            return false;
        }
        var firstChar = value.charAt(0);
        return firstChar === '#' || firstChar === '.' || /^[a-z]/i.test(firstChar);
    },

    /**
     * Returns the template for the given selector
     *
     * @param {String} selector
     * @returns {String}
     * @private
     */
    _getTemplateForSelector: function (selector) {
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
    getTemplateParser: function () {
        if (!this._templateParser) {
            this._templateParser = new IrLib.View.Parser.Parser();
        }
        return this._templateParser;
    }
});