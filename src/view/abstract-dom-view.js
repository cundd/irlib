/**
 * Created by COD on 25.06.15.
 */
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
     * @type {String}
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

    init: function () {
        var _this = this;

        this._super();

        this._eventListeners = {};
        if (typeof this.eventListeners === 'object') { // Check if a eventListeners variables are inherited
            (new IrLib.Dictionary(this.eventListeners)).forEach(function(imp, key) {
                _this.addEventListener(key, imp);
            });
        } else if (typeof this.events === 'object') { // Check if a events variables are inherited
            (new IrLib.Dictionary(this.events)).forEach(function(imp, key) {
                _this.addEventListener(key, imp);
            });
        }

        this.defineProperty(
            'needsRedraw',
            {
                enumerable: true,
                get: this.getNeedsRedraw
            }
        );
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
        } else {
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
        var imps = this._eventListeners[event.type],
            patchedEvent, currentImp, i;

        if (imps) {
            patchedEvent = this._patchEvent(event);
            for (i = 0; i < imps.length; i++) {
                currentImp = imps[i];
                if (typeof currentImp === 'undefined') {
                    throw new TypeError('Implementation for event type "' + event.type + '" is undefined');
                } else if (typeof currentImp === 'function') {
                    currentImp.call(this, patchedEvent);
                } else if (currentImp.handleEvent) {
                    currentImp.handleEvent.call(currentImp, patchedEvent);
                }
            }
        } else {
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
     * @param {String} type
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
        var eventTypesLength = eventTypes.length,
            i, type;
        for (i = 0; i < eventTypesLength; i++) {
            type = eventTypes[i];
            element.addEventListener(type, this);
        }
    },

    /**
     * Add the stored event listeners to the DOM Node
     */
    addStoredEventListeners: function() {
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
     * @param {String} [template]
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
    clone: function() {
        var source = this,
            _clone = new (source.constructor)();
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
