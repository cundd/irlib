/**
 * Created by COD on 25.06.15.
 */

/**
 * A template based view
 */
IrLib.View.Template = IrLib.View.Interface.extend({
    /**
     * Registry of event listeners
     *
     * @type {Object}
     */
    eventListeners: {},

    /**
     * Template to render
     *
     * @type {String}
     */
    _template: '',

    /**
     * Dictionary of template variables
     *
     * @type {IrLib.Dictionary}
     */
    _variables: null,

    /**
     * Defines if a redraw is required
     *
     * @type {Boolean}
     */
    needsRedraw: true,

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

    init: function (template, variables) {
        if (arguments.length > 0) {
            if (typeof template !== 'string') {
                throw new TypeError('Argument "template" is not of type string');
            }
            this._template = template.trim();
        }
        this.setVariables(variables || {});
        this.eventListeners = {};
    },

    /**
     * Renders the template
     *
     * @return {Node|HTMLElement}
     */
    render: function () {
        if (this.needsRedraw) {
            if (!this._template) {
                throw new ReferenceError('Template not specified');
            }

            this._dom = this._createDom(
                this._renderVariables(this._template)
            );
            //_template = this._renderActions(_template);

            this.needsRedraw = false;
        }
        return this._dom;
    },

    /**
     * Creates the Document Object Model for the given template string
     *
     * @param {String} template
     * @returns {Node|HTMLElement}
     * @private
     */
    _createDom: function (template) {
        var root = document.createElement('div');
        root.innerHTML = template;
        return root.firstChild;
    },

    /**
     * Replace the variables inside the given template
     *
     * @param {String} template
     * @returns {String}
     */
    _renderVariables: function (template) {
        this._variables.forEach(function (value, key) {
            var replaceExpression = new RegExp('\\{\\{' + key + '\\}\\}', 'g');
            template = template.replace(replaceExpression, value);
        });

        /* Clean up unresolved variables */
        return template.replace(/\{\{[\w\.\-]+}}/g, '');
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
     * Set the variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @returns {IrLib.View.Template}
     */
    setVariables: function (data) {
        if (data instanceof IrLib.Dictionary) {
            this._variables = data;
        } else {
            this._variables = new IrLib.Dictionary(data);
        }
        this.needsRedraw = true;
        return this;
    },

    /**
     * Add the variable with the given key and value
     *
     * @param {String} key
     * @param {*} value
     * @returns {IrLib.View.Template}
     */
    assignVariable: function (key, value) {
        this._variables[key] = value;
        this.needsRedraw = true;
        return this;
    },

    /**
     * Sets the template
     *
     * @param {String} template
     * @returns {IrLib.View.Template}
     */
    setTemplate: function (template) {
        this._template = template;
        this.needsRedraw = true;
        return this;
    },

    /**
     * Appends the View to the given DOM element, while replacing the previously rendered element
     *
     * @param {Node|HTMLElement} element
     * @returns {IrLib.View.Template}
     */
    appendTo: function(element) {
        if (!element || typeof element.appendChild !== 'function') {
            throw new TypeError('Given element is not a valid DOM Node');
        }

        this.render();
        if (this._lastInsertedNode) {
            element.replaceChild(this._dom, this._lastInsertedNode);
        } else {
            element.appendChild(this._dom);
        }
        this._lastInsertedNode = this._dom;
        return this;
    },

    /**
     * Removes the element from it's parent
     *
     * @returns {IrLib.View.Template}
     */
    remove: function() {
        var lastInsertedNode = this._lastInsertedNode;
        if (lastInsertedNode && lastInsertedNode.parentNode) {
            lastInsertedNode.parentNode.removeChild(lastInsertedNode);
        }
        return this;
    },

    /**
     * Handle the DOM event
     *
     * @param {Event} event
     */
    handleEvent: function(event) {
        /** @type IrLib.Dictionary imps */
        var imps = this.eventListeners[event.type],
            impsArray, patchedEvent, currentImp, i;

        if (imps) {
            impsArray = imps.values();
            patchedEvent = this._patchEvent(event);
            for (i = 0; i < impsArray.length; i++) {
                currentImp = impsArray[i];
                if (typeof currentImp === 'function') {
                    currentImp(patchedEvent);
                } else if (currentImp.handleEvent) {
                    currentImp.handleEvent.call(currentImp, patchedEvent);
                }
            }
        } else {
            console.log(event);
        }
    },

    /**
     * Create a patches version of the event and set it's target to the View
     *
     * @param {Event} event
     * @returns {Event}
     * @private
     */
    _patchEvent: function(event) {
        event.irTarget = this;
        return event;
    },

    /**
     * Returns the ID of the listener
     *
     * @param {Function|Object} value
     * @returns {string}
     * @private
     */
    _getListenerId: function(value) {
        if (typeof value === 'function') {
            return value + '';
        }

        /** @type IrLib.CoreObject value */
        if (typeof value === 'object' && typeof value.guid === 'function') {
            return value.guid();
        }
        return value + '';
    },

    /**
     * Adds the given event listener to the View
     *
     * @param {String} type
     * @param {EventListener|Function} listener
     * @param {Boolean} [useCapture] Currently ignored
     */
    addEventListener: function (type, listener, useCapture) {
        var _eventListeners = this.eventListeners;

        if (!_eventListeners[type]) {
            _eventListeners[type] = new IrLib.Dictionary();
        }

        _eventListeners[type][this._getListenerId(listener)] = listener;
        this.render().addEventListener(type, this);
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
    }
});