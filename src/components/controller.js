/**
 * Created by COD on 03.06.15.
 */

var GeneralUtility = IrLib.Utility.GeneralUtility;
var _Error = IrLib.Error;

/**
 * @implements EventListener
 */
IrLib.Controller = IrLib.CoreObject.extend({
    /**
     * @type {IrLib.View.Interface|IrLib.View.Template|HTMLElement|String}
     */
    _view: null,

    /**
     * List of all registered events
     *
     * @type {String[]}
     */
    _registeredEvents: [],

    /**
     * Initialize the controller
     *
     * @param {HTMLElement|String} [view] A dom node or selector
     */
    init: function (view) {
        if (arguments.length > 0) { // Check if the view argument is given
            this.setView(view);
        } else if (this.view) { // Check if a view is inherited
            this.setView(this.view);
        }
        this.defineProperty('view', {
            enumerable: true,
            get: this.getView,
            set: this.setView
        });
    },

    /**
     * Handle the DOM event
     *
     * @param {Event} event
     */
    handleEvent: function (event) {
        var controller = this,
            type = event.type,
            target = event.target,
            _events = controller.events,
            targetsTargetAttribute, imp;

        // Workaround for jsdom based unit tests
        if (!_events && typeof event.irController === 'object') {
            controller = event.irController;
            _events = controller.events;
        }

        // Check if the data-irlib-target attribute is set
        if (typeof target.getAttribute === 'function') {
            targetsTargetAttribute = target.getAttribute('data-irlib-target');
        }

        // If the data-irlib-target attribute is set look for a matching implementation
        if (targetsTargetAttribute) {
            var matchingImpName = Object.keys(_events).filter(function (eventIdentifier) {
                var eventIdentifierParts = eventIdentifier.split(':');

                return eventIdentifierParts.length > 1 &&
                    eventIdentifierParts[1] === targetsTargetAttribute && // Matching target attribute
                    eventIdentifierParts[0] === type // Matching event type
                    ;
            });

            if (matchingImpName.length > 0) {
                imp = _events[matchingImpName[0]];
            }
        }

        if (!imp && _events && _events[type]) {
            imp = _events[type];
        }

        if (typeof imp === 'function') {
            imp.call(controller, event);
        } else if (imp) {
            IrLib.Logger.error('Event handler implementation is of type ' + (typeof event));
        } else {
            IrLib.Logger.debug('Unhandled event', event);
        }
    },

    /**
     * Sets the view
     *
     * @param {IrLib.View.Interface|IrLib.View.Template|HTMLElement|String} view A View object, dom node or selector
     */
    setView: function (view) {
        this._assertView(view);
        if (typeof view === 'string') { // If the view is a selector
            this._view = GeneralUtility.domNode(view);
        } else {
            this._view = view;
        }
    },

    /**
     * Returns the view
     *
     * @returns {IrLib.View.Interface|IrLib.View.Template|HTMLElement|String}
     */
    getView: function () {
        return this._view;
    },

    /**
     * Register the Controller as event listener for each event
     *
     * @returns {IrLib.Controller}
     */
    catchAllViewEvents: function () {
        var registeredEvents = this._registeredEvents,
            inline_splitEventIdentifier = this._splitEventIdentifier,
            _view = this.view,
            domElement, property;
        if (_view) {
            if (_view instanceof IrLib.View.Interface) {
                domElement = document.createElement('div');
            } else {
                domElement = _view;
            }

            for (property in domElement) {
                if (property.substr(0, 2) === 'on') {
                    registeredEvents.push(
                        inline_splitEventIdentifier(property.substr(2))[0]
                    );
                }
            }
            this._addListenersForRegisteredEventTypes();
        } else {
            IrLib.Logger.warn('Can not catch all events because the view not set');
        }
        return this;
    },

    /**
     * Register the Controller as event listener for each of the callbacks defined in
     * the events property
     *
     * @returns {IrLib.Controller}
     */
    initializeEventListeners: function () {
        var registeredEvents = this._registeredEvents,
            inline_splitEventIdentifier = this._splitEventIdentifier,
            _view = this.view,
            _eventNames, i;
        if (_view) {
            _eventNames = this.eventNames();
            for (i = 0; i < _eventNames.length; i++) {
                registeredEvents.push(inline_splitEventIdentifier(_eventNames[i])[0]);
            }
            this._addListenersForRegisteredEventTypes();
        } else {
            IrLib.Logger.warn('Can not add event listener because the view not set');
        }
        return this;
    },

    /**
     * Removes the event listeners
     */
    removeEventListeners: function () {
        var registeredEvents = this._registeredEvents,
            _view = this.view,
            i;
        if (_view) {
            for (i = 0; i < registeredEvents.length; i++) {
                _view.removeEventListener(registeredEvents[i], this, false);
            }
            this._registeredEvents = [];
        } else {
            IrLib.Logger.warn('Can not remove event listeners because the view not set');
        }
    },

    /**
     * Returns the event names
     *
     * @returns {Array}
     */
    eventNames: function () {
        return Object.keys(this.events);
    },

    /**
     * Actually add the event listeners listed in _registeredEvents to the View
     *
     * @private
     */
    _addListenersForRegisteredEventTypes: function () {
        var registeredEvents = this._registeredEvents,
            registeredEventsLength = registeredEvents.length,
            _view = this.view,
            i;
        if (_view) {
            for (i = 0; i < registeredEventsLength; i++) {
                _view.addEventListener(registeredEvents[i], this, false);
            }
        }
    },

    /**
     * Split the given event identifier into it's type and action-target parts
     *
     * Example:
     *  click:my-action => click, my-action
     *  click:data-attribute-to-match => click, data-attribute-to-match
     *
     * @param {String} eventIdentifier
     * @returns {String[]}
     * @private
     */
    _splitEventIdentifier: function (eventIdentifier) {
        return eventIdentifier.split ? eventIdentifier.split(':') : eventIdentifier;
    },

    /**
     * Tests if the given value is a view
     *
     * @param {*} view
     * @private
     */
    _assertView: function (view) {
        if (!view) {
            throw new _Error('No view given', 1433355412);
        }

        var ViewInterface = IrLib.View && IrLib.View.Interface ? IrLib.View.Interface : function () {
        };
        if (!GeneralUtility.domNode(view) && !(view instanceof ViewInterface)) {
            throw new _Error('No view given', 1433355412, view);
        }
    },

    /**
     * Registered event handler methods
     */
    events: {}
});