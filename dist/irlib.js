var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by COD on 03.06.15.
 */
// export namespace IrLib {
//     Config = {};
// }
/**
 * Created by COD on 03.06.15.
 */
/**
 * Created by daniel on 25/03/16.
 */
/**
 * Created by COD on 04.07.14.
 */
/**
 * Object representation of an URL
 *
 * @param {string} href
 * @constructor
 */
/**
 * Created by COD on 25.06.15.
 */
// 'view/interface');
// require('view/abstract-variable-view');
require('view/interface');
/**
 * An abstract view with DOM support
 *
 * @implements EventListener
 * @abstract
 */
IrLib.View.AbstractDomView = IrLib.View.AbstractContextAwareView.extend({
    /**
     * Tag name for the HTML node that encapsulates the generated nodes
     *
     * @type {string}
     */
    tagName: 'div',
    /**
     * Registry of event listeners
     *
     * @type {Object}
     */
    _eventListeners: null,
    /**
     * Defines if a redraw is required
     *
     * @type {Boolean}
     */
    _needsRedraw: true,
    /**
     * DOM element
     *
     * @type {Node|HTMLElement}
     */
    _dom: null,
    /**
     * Last inserted node which should be replaced
     *
     * @type {Node}
     */
    _lastInsertedNode: null,
    constructor: function () {
        var _this = this;
        this._super();
        this._eventListeners = {};
        if (typeof this.eventListeners === 'object') {
            (new IrLib.Dictionary(this.eventListeners)).forEach(function (imp, key) {
                _this.addEventListener(key, imp);
            });
        }
        else if (typeof this.events === 'object') {
            (new IrLib.Dictionary(this.events)).forEach(function (imp, key) {
                _this.addEventListener(key, imp);
            });
        }
        this.defineProperty('needsRedraw', {
            enumerable: true,
            get: this.getNeedsRedraw
        });
    },
    /**
     * Renders the template
     *
     * @return {Node|HTMLElement}
     */
    render: function () {
        if (this._needsRedraw) {
            delete this._dom;
            var _template = this.template;
            if (!_template) {
                throw new ReferenceError('Template not specified');
            }
            this._dom = this._createDom(this.toString());
            this._needsRedraw = false;
        }
        return this._dom;
    },
    /**
     * Returns if a redraw is required
     *
     * @returns {Boolean}
     */
    getNeedsRedraw: function () {
        return this._needsRedraw;
    },
    /**
     * Returns if the View is in the visible DOM
     *
     * @returns {Boolean}
     */
    isVisible: function () {
        var element = this._dom;
        return !!(element && element.parentNode && document.body.contains(element));
    },
    /**
     * Appends the View to the given DOM element, while replacing the previously rendered element
     *
     * @param {Node|HTMLElement} element
     * @returns {IrLib.View.Interface}
     */
    appendTo: function (element) {
        if (!element || typeof element.appendChild !== 'function') {
            throw new TypeError('Given element is not a valid DOM Node');
        }
        this.render();
        if (this._lastInsertedNode) {
            element.replaceChild(this._dom, this._lastInsertedNode);
        }
        else {
            element.appendChild(this._dom);
        }
        this._lastInsertedNode = this._dom;
        this.addStoredEventListeners();
        return this;
    },
    /**
     * Reloads the Views output in the DOM
     *
     * @param {Boolean} [force]
     * @returns {IrLib.View.Interface}
     */
    reload: function (force) {
        var lastParent = this._dom ? this._dom.parentNode : (this._lastInsertedNode ? this._lastInsertedNode.parentNode : null);
        if (!lastParent) {
            throw new ReferenceError('Can not reload because the view does not seem to be in the DOM');
        }
        if (force || this._needsRedraw) {
            this._needsRedraw = true;
            this.appendTo(lastParent);
        }
        return this;
    },
    /**
     * Removes the element from it's parent
     *
     * @returns {IrLib.View.Interface}
     */
    remove: function () {
        var lastInsertedNode = this._lastInsertedNode;
        if (lastInsertedNode && lastInsertedNode.parentNode) {
            lastInsertedNode.parentNode.removeChild(lastInsertedNode);
            this._lastInsertedNode = null;
        }
        return this;
    },
    /**
     * Handle the DOM event
     *
     * @param {Event} event
     */
    handleEvent: function (event) {
        var imps = this._eventListeners[event.type], patchedEvent, currentImp, i;
        if (imps) {
            patchedEvent = this._patchEvent(event);
            for (i = 0; i < imps.length; i++) {
                currentImp = imps[i];
                if (typeof currentImp === 'undefined') {
                    throw new TypeError('Implementation for event type "' + event.type + '" is undefined');
                }
                else if (typeof currentImp === 'function') {
                    currentImp.call(this, patchedEvent);
                }
                else if (currentImp.handleEvent) {
                    currentImp.handleEvent.call(currentImp, patchedEvent);
                }
            }
        }
        else {
            IrLib.Logger.log(event);
        }
    },
    /**
     * Create a patches version of the event and set it's target to the View
     *
     * @param {Event} event
     * @returns {Event}
     * @private
     */
    _patchEvent: function (event) {
        event.irTarget = this;
        return event;
    },
    /**
     * Adds the given event listener to the View
     *
     * @param {string} type
     * @param {EventListener|Function} listener
     * @param {Boolean} [useCapture] Currently ignored
     */
    addEventListener: function (type, listener, useCapture) {
        var _eventListeners = this._eventListeners;
        if (!_eventListeners[type]) {
            _eventListeners[type] = [listener];
        }
        if (_eventListeners[type].indexOf(listener) === -1) {
            _eventListeners[type].push(listener);
        }
        this._addEventListeners(this.render(), [type]);
    },
    /**
     * Add event listeners for each given event types to the element
     *
     * @param {HTMLElement} element
     * @param {String[]} eventTypes
     * @private
     */
    _addEventListeners: function (element, eventTypes) {
        var eventTypesLength = eventTypes.length, i, type;
        for (i = 0; i < eventTypesLength; i++) {
            type = eventTypes[i];
            element.addEventListener(type, this);
        }
    },
    /**
     * Add the stored event listeners to the DOM Node
     */
    addStoredEventListeners: function () {
        if (!this._dom) {
            throw new ReferenceError('DOM is not render yet');
        }
        this._addEventListeners(this._dom, Object.keys(this._eventListeners));
    },
    /**
     * Dispatches an Event at the View, invoking the affected EventListeners in the appropriate order.
     *
     * The normal event processing rules (including the capturing and optional bubbling phase) apply to events
     * dispatched manually with dispatchEvent().
     *
     * @param {Event} event
     * @return {Boolean}
     */
    dispatchEvent: function (event) {
        this.render().dispatchEvent(event);
    },
    /**
     * Creates the Document Object Model for the given template string
     *
     * @param {string} [template]
     * @returns {Node|HTMLElement}
     * @protected
     */
    _createDom: function (template) {
        var root = document.createElement(this.tagName);
        if (template) {
            root.innerHTML = template;
        }
        return root;
    },
    /**
     * Returns a clone of this object
     *
     * @returns {*}
     */
    clone: function () {
        var source = this, _clone = new (source.constructor)();
        for (var attr in source) {
            if (source.hasOwnProperty(attr)) {
                if (attr === '_dom' || attr === '_lastInsertedNode' || attr === '_eventListeners') {
                    continue;
                }
                _clone[attr] = source[attr];
            }
        }
        _clone.__guid = IrLib.CoreObject.createGuid();
        return _clone;
    }
});
/**
 * Created by COD on 25.06.15.
 */
IrLib.View = IrLib.View || {};
/**
 * Defines a common interface for context aware Views
 *
 * @interface
 */
IrLib.View.ContextInterface = function () {
};
IrLib.View.ContextInterface.prototype.setContext = function () {
    throw new IrLib.MissingImplementationError('setContext');
};
IrLib.View.ContextInterface.prototype.getContext = function () {
    throw new IrLib.MissingImplementationError('getContext');
};
/**
 * Created by COD on 25.06.15.
 */
// require('view/template');
/**
 * Created by COD on 25.06.15.
 */
IrLib.View = IrLib.View || {};
/**
 * Current template block information
 *
 * @param {Number} index
 * @param {Block[]} blockStream
 * @constructor
 */
IrLib.View.State = function (index, blockStream) {
    this.index = index | 0;
    this.blockStream = blockStream;
};
/**
 * Created by COD on 25.06.15.
 */
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
    constructor: function (template, variables) {
        this._super(template, variables);
        if (arguments.length > 0) {
            if (typeof template !== 'string') {
                throw new TypeError('Argument "template" is not of type string');
            }
            this.setTemplate(template);
        }
        else if (typeof this.template === 'string') {
            this.setTemplate(this.template.slice(0));
        }
        if (typeof this.computed === 'object') {
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
    toString: function () {
        return this._renderBlocks();
    },
    /**
     * Renders the template
     *
     * @return {Node|HTMLElement}
     */
    render: function () {
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
    _renderBlocks: function () {
        var BlockType = IrLib.View.Parser.BlockType, State = IrLib.View.State, templateBlocks = this.getTemplateBlocks(), templateBlocksLength = templateBlocks.length, inline_escapeHtml = this._escapeHtml, inline_resolveVariable = this._resolveVariable.bind(this), inline_renderExpression = this._renderExpression.bind(this), renderedTemplate = '', currentVariableValue, currentMeta, currentTemplateBlock, index;
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
    _renderExpression: function (block, state) {
        var ExpressionType = IrLib.View.Parser.ExpressionType, expressionParts = block.content.split(' '), lastConditionStateStack = this._lastConditionStateStack, meta = block.meta, output, view, viewId;
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
                }
                else {
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
                var conditionKey = expressionParts[1], conditionValue = this._resolveVariable(conditionKey);
                if (this._evaluateConditionValue(conditionValue)) {
                    /* Continue rendering the next blocks */
                    lastConditionStateStack.push(true);
                }
                else {
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
    _evaluateConditionValue: function (conditionValue) {
        return ((Array.isArray(conditionValue) && conditionValue.length > 0) ||
            (typeof conditionValue === 'object' && Object.keys(conditionValue).length > 0) || !!conditionValue);
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
        var blockStream = state.blockStream, blockStreamLength = blockStream.length, EXPRESSION = IrLib.View.Parser.BlockType.EXPRESSION, EXPRESSION_TYPE_ELSE = IrLib.View.Parser.ExpressionType.ELSE, nestingDepth = 1, i = state.index, balanced = false, block, expressionType;
        for (; i < blockStreamLength; i++) {
            /** @type {IrLib.View.Parser.Block} */
            block = blockStream[i];
            if (block.type === EXPRESSION) {
                expressionType = block.meta.expressionType;
                if (expressionType === startExpression) {
                    nestingDepth++;
                }
                else if (expressionType === endExpression) {
                    nestingDepth--;
                    if (nestingDepth < 1) {
                        balanced = true;
                        break;
                    }
                }
                else if (nestingDepth === 1 && expressionType === EXPRESSION_TYPE_ELSE) {
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
    _resolveVariable: function (keyPath) {
        var result;
        try {
            result = IrLib.Utility.GeneralUtility.valueForKeyPathOfObject(keyPath, this.getVariables(), false);
            if (typeof result === 'function') {
                result = result(this);
            }
        }
        catch (error) {
            if (!(error instanceof TypeError)) {
                throw error;
            }
        }
        if (!result && keyPath.indexOf('.') === -1) {
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
    _resolveAndEvaluateComputed: function (key) {
        var _computed = this.computed, registeredComputed;
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
    _resolveView: function (viewIdentifier) {
        var _serviceLocator = this.serviceLocator, view;
        if (!_serviceLocator) {
            throw new ReferenceError('Service Locator must be set to resolve views for identifier "' + viewIdentifier + '"');
        }
        try {
            view = this.serviceLocator.get(viewIdentifier);
        }
        catch (exception) {
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
    replaceSubviewPlaceholders: function () {
        var _dom = this._dom;
        this._subviewPlaceholders.forEach(function (view, elementId) {
            var placeholder = _dom.querySelector('#' + elementId);
            //console.log(placeholder, elementId, view.render());
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.replaceChild(view.render(), placeholder);
                view.addStoredEventListeners();
            }
            else {
                throw new ReferenceError('Could not find subview placeholder #' + elementId);
            }
        });
        this._subviewPlaceholders = new IrLib.Dictionary();
    },
    /**
     * @inheritDoc
     */
    appendTo: function (element) {
        this._super(element);
        this.replaceSubviewPlaceholders();
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
        }
        else {
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
    getComputed: function () {
        return this._computed;
    },
    /**
     * Sets the template
     *
     * @param {string} template
     * @returns {IrLib.View.Template}
     */
    setTemplate: function (template) {
        var templateTemporary = template.trim();
        if (this._isSelector(templateTemporary)) {
            this._template = this._getTemplateForSelector(templateTemporary);
        }
        else {
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
    _getTemplateForSelector: function (selector) {
        var templateElement = document.querySelector(selector), templateHtml;
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
    },
    /**
     * Returns a clone of this object
     *
     * @returns {*}
     */
    clone: function () {
        var _clone = this._super();
        _clone._subviewPlaceholders = new IrLib.Dictionary();
        _clone._lastConditionStateStack = [];
        return _clone;
    }
});
/**
 * Created by COD on 25.06.15.
 */
IrLib.View = IrLib.View || {};
/**
 * Defines a common interface for Views with variables
 *
 * @interface
 */
IrLib.View.VariableViewInterface = function () {
};
/**
 * Sets the variables
 *
 * @param {Object|IrLib.Dictionary} data
 * @returns {IrLib.View.Interface}
 */
IrLib.View.VariableViewInterface.prototype.setVariables = function (data) {
    throw new IrLib.MissingImplementationError('setVariables');
};
/**
 * Adds the variable with the given key and value
 *
 * @param {string} key
 * @param {*} value
 * @returns {IrLib.View.Interface}
 */
IrLib.View.VariableViewInterface.prototype.assignVariable = function (key, value) {
    throw new IrLib.MissingImplementationError('assignVariable');
};
/**
 * Returns the currently assigned variables
 *
 * @returns {IrLib.Dictionary}
 */
IrLib.View.VariableViewInterface.prototype.getVariables = function () {
    throw new IrLib.MissingImplementationError('getVariables');
};
/**
 * Created by COD on 25.06.15.
 */
//# sourceMappingURL=irlib.js.map