/**
 * Created by COD on 03.06.15.
 */
import CoreObject from "../core-object";

var GeneralUtility = IrLib.Utility.GeneralUtility;
var _Error = IrLib.Error;

/**
 * @implements EventListener
 */
export default class Controller extends CoreObject {
    constructor() {
        /**
         * @type {IrLib.View.Interface|IrLib.View.Template|HTMLElement|String}
         */
        this._view = null;

        /**
         * List of all registered events
         *
         * @type {String[]}
         */
        this._registeredEvents = [];

        /**
         * Registered event handler methods
         * @type {{}}
         */
        this.events = {}
    }

    /**
     * Initialize the controller
     *
     * @param {HTMLElement|String} [view] A dom node or selector
     */
    init(view) {
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
    }

    /**
     * Handle the DOM event
     *
     * @param {Event} event
     * @returns {*}
     */
    handleEvent(event) {
        let controller = this;
        const type = event.type;
        const target = event.target;
        let _events = controller.events;
        let targetsTargetAttribute;
        let imp;

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
            const matchingImpName = Object.keys(_events).filter(function (eventIdentifier) {
                const eventIdentifierParts = eventIdentifier.split(':');

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
            return imp.call(controller, event);
        } else if (imp) {
            IrLib.Logger.error('Event handler implementation is of type ' + (typeof event));
            return false;
        }
        return true;
    }

    /**
     * Sets the view
     *
     * @param {IrLib.View.Interface|IrLib.View.Template|HTMLElement|String} view A View object, dom node or selector
     */
    setView(view) {
        this._assertView(view);
        if (typeof view === 'string') { // If the view is a selector
            this._view = GeneralUtility.domNode(view);
        } else {
            this._view = view;
        }
    }

    /**
     * Returns the view
     *
     * @returns {IrLib.View.Interface|IrLib.View.Template|HTMLElement|String}
     */
    getView() {
        return this._view;
    }

    /**
     * Register the Controller as event listener for each event
     *
     * @returns {IrLib.Controller}
     */
    catchAllViewEvents() {
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
    }

    /**
     * Register the Controller as event listener for each of the callbacks defined in
     * the events property
     *
     * @returns {IrLib.Controller}
     */
    initializeEventListeners() {
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
    }

    /**
     * Removes the event listeners
     */
    removeEventListeners() {
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
    }

    /**
     * Returns the event names
     *
     * @returns {Array}
     */
    eventNames() {
        return Object.keys(this.events);
    }

    /**
     * Actually add the event listeners listed in _registeredEvents to the View
     *
     * @private
     */
    _addListenersForRegisteredEventTypes() {
        var registeredEvents = this._registeredEvents,
            registeredEventsLength = registeredEvents.length,
            _view = this.view,
            i;
        if (_view) {
            for (i = 0; i < registeredEventsLength; i++) {
                _view.addEventListener(registeredEvents[i], this, false);
            }
        }
    }

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
    _splitEventIdentifier(eventIdentifier) {
        return eventIdentifier.split ? eventIdentifier.split(':') : eventIdentifier;
    }

    /**
     * Tests if the given value is a view
     *
     * @param {*} view
     * @private
     */
    _assertView(view) {
        if (!view) {
            throw new _Error('No view given', 1433355412);
        }

        var ViewInterface = IrLib.View && IrLib.View.Interface ? IrLib.View.Interface() : {};
        if (!GeneralUtility.domNode(view) && !(view instanceof ViewInterface)) {
            throw new _Error('No view given', 1433355412, view);
        }
    }
}
    