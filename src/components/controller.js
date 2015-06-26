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
     * @type {HTMLElement}
     */
    view: null,

    /**
     * Initialize the controller
     *
     * @param {HTMLElement|String} [view] A dom node or selector
     */
    init: function(view) {
        if (arguments.length > 0) {
            this.setView(view);
        } else if (this.view) {
            this.setView(this.view);
        }
    },

    /**
     * Handle the DOM event
     *
     * @param {Event} event
     */
    handleEvent: function(event) {
        var controller = this,
            type = event.type,
            _events = controller.events;

        // Workaround for jsdom based unit tests
        if (!_events && typeof event.irController === 'object') {
            controller = event.irController;
            _events = controller.events;
        }

        if (_events && _events[type]) {
            _events[type].call(controller, event);
        } else {
            IrLib.Logger.debug('Unhandled event', event);
        }
    },

    /**
     * Sets the view
     *
     * @param {IrLib.View.Interface|IrLib.View.Template|HTMLElement|String} view A View object, dom node or selector
     */
    setView: function(view) {
        this._assertView(view);
        this.view = view;
    },

    /**
     * Initialize the event listeners
     */
    initializeEventListeners: function() {
        var _view = this.view,
        _eventNames, i;
        if (_view) {
            _eventNames = this.eventNames();
            for (i = 0; i < _eventNames.length; i++) {
                _view.addEventListener(_eventNames[i], this, false);
            }
        }
    },

    /**
     * Removes the event listeners
     */
    removeEventListeners: function() {
        var _view = this.view,
        _eventNames, i;
        if (_view) {
            _eventNames = this.eventNames();
            for (i = 0; i < _eventNames.length; i++) {
                _view.removeEventListener(_eventNames[i], this, false);
            }
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
     * Tests if the given value is a view
     *
     * @param {*} view
     * @private
     */
    _assertView: function (view) {
        if (!view) {
            throw new _Error('No view given', 1433355412);
        }

        var ViewInterface = IrLib.View && IrLib.View.Interface ? IrLib.View.Interface : function() {};
        if (!GeneralUtility.domNode(view) && !(view instanceof ViewInterface)) {
            throw new _Error('No view given', 1433355412, view);
        }
    },

    /**
     * Registered event handler methods
     */
    events: {

    }
});