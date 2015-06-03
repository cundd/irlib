/**
 * Created by COD on 03.06.15.
 */
/*jslint unparam: true */
/*global window, require, exports */

(function(exports){
    var IrLib = exports;

/*    require('core-object');// */

/**
 * Created by COD on 03.06.15.
 */
/*require('class');// */

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// jshint ignore: start
// Inspired by base2 and Prototype
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();





IrLib.CoreObject = Class.extend({
});




/*    require('error');// */

/**
 * Created by COD on 14.04.15.
 */
var _Error = IrLib.Error = function (message, code, userInfo) {
    this.message = message;
    this.code = code;
    this.userInfo = userInfo;
};

_Error.prototype = {
    toString: function() {
        return '[KungFu.Error] ' +
            (this.code ? '#' + this.code + ':' : '') +
            this.message;
    }
};




/*    require('utility\/*');// */

/**
 * Created by COD on 03.06.15.
 */

IrLib.Utility = IrLib.Utility || {};

var _GeneralUtility = IrLib.Utility.GeneralUtility = {
    /**
     * Returns if the given element is a HTML node
     *
     * @param {*} element
     * @returns {Boolean}
     */
    isDomNode: function(element) {
        return !!(element && element.nodeName);
    },

    /**
     * Returns the matching HTML node
     *
     * @param {*} element
     * @returns {HTMLElement}
     */
    domNode: function(element) {
        if (_GeneralUtility.isDomNode(element)) {
            return element;
        }
        if (typeof element === 'string') {
            return document.querySelector(element);
        }
        return null;
    }
};

/**
 * Created by COD on 14.04.15.
 */
var ef = function() {};
var Logger = IrLib.Logger = console || {};

if (!Logger.debug) {
    Logger.debug = ef;
}
if (!Logger.info) {
    Logger.info = ef;
}
if (!Logger.warn) {
    Logger.warn = ef;
}





/*    require('components\/*');// */

/**
 * Created by COD on 03.06.15.
 */

var GeneralUtility = IrLib.Utility.GeneralUtility;
var _Error = IrLib.Error;
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
     * Sets the view
     *
     * @param {HTMLElement|String} view A dom node or selector
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
                var eventName = _eventNames[i];
                var callback = this.events[eventName];
                _view.addEventListener(eventName, callback.bind(this));
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
        if (!GeneralUtility.domNode(view)) {
            throw new _Error('No view given', 1433355412, view);
        }
    },

    events: {

    }
});

/**
 * Created by COD on 04.07.14.
 */
/**
 * Object representation of an URL
 *
 * @param {String} href
 * @constructor
 */
IrLib.Url = function (href) {
    if (arguments.length > 0) {
        if (href instanceof IrLib.Url) {
            href = href + '';
        }
        var parser = document.createElement('a');
        parser.href = href;

        this.protocol = parser.protocol; // => "http:"
        this._host = parser.host;     // => "example.com:3000"
        this._hostname = parser.hostname; // => "example.com"
        this._port = parser.port;     // => "3000"
        this._pathname = parser.pathname; // => "/pathname/"
        this.hash = parser.hash;     // => "#hash"
        this.search = parser.search;   // => "?search=test"
    } else {
        this.protocol = '';
        this._host = '';
        this._hostname = '';
        this._port = '';
        this._pathname = '';
        this.hash = '';
        this.search = '';
    }

    Object.defineProperty(this, 'host', {
        get: this.getHost,
        set: this.setHost
    });
    Object.defineProperty(this, 'hostname', {
        get: this.getHostname,
        set: this.setHostname
    });
    Object.defineProperty(this, 'port', {
        get: this.getPort,
        set: this.setPort
    });
    Object.defineProperty(this, 'pathname', {
        get: this.getPathname,
        set: this.setPathname
    });
};

/**
 * Returns the current browser URL
 *
 * @returns {IrLib.Url}
 */
IrLib.Url.current = function () {
    return new IrLib.Url(window.location.href);
};

IrLib.Url.prototype = {
    /**
     * Returns the host
     * @returns {String}
     */
    getHost: function () {
        return this._host;
    },

    /**
     * Sets the host
     * @returns {String}
     */
    setHost: function (newValue) {
        var hostDefinitionParts = newValue.split(':');
        this._host = newValue;
        this._hostname = hostDefinitionParts[0];
        this._port = hostDefinitionParts[1];
    },

    /**
     * Returns the hostname
     * @returns {String}
     */
    getHostname: function () {
        return this._hostname;
    },

    /**
     * Sets the hostname
     * @returns {String}
     */
    setHostname: function (newValue) {
        this._hostname = newValue;
        this._host = newValue + ':' + this._port;
    },

    /**
     * Returns the port
     * @returns {String}
     */
    getPort: function () {
        return this._port;
    },

    /**
     * Sets the port
     * @returns {String}
     */
    setPort: function (newValue) {
        this._port = newValue;
        this._host = this._hostname + ':' + newValue;
    },

    /**
     * Returns the protocol
     *
     * @returns {String}
     */
    getProtocol: function () {
        return this.protocol;
    },

    /**
     * Sets the protocol
     *
     * @param {String} newValue
     */
    setProtocol: function (newValue) {
        this.protocol = newValue;
    },

    /**
     * Returns the pathname
     *
     * @returns {String}
     */
    getPathname: function () {
        return this._pathname;
    },

    /**
     * Sets the pathname
     *
     * @param {String} newValue
     */
    setPathname: function (newValue) {
        if (newValue[0] !== '/') {
            newValue = '/' + newValue;
        }
        this._pathname = newValue;
    },

    /**
     * Returns the hash
     *
     * @returns {String}
     */
    getHash: function () {
        return this.hash;
    },

    /**
     * Sets the hash
     *
     * @param {String} newValue
     */
    setHash: function (newValue) {
        this.hash = newValue;
    },

    /**
     * Returns the search
     *
     * @returns {String}
     */
    getSearch: function () {
        return this.search;
    },

    /**
     * Sets the search
     *
     * @param {String} newValue
     */
    setSearch: function (newValue) {
        this.search = newValue;
    },

    /**
     * Returns if the URL is local
     *
     * @returns {boolean}
     */
    isLocal: function () {
        return window.location.host == this.host;
    },

    /**
     * Returns if the URL is equal to the current page
     *
     * @param {boolean} [ignoreSearch] If set to TRUE the URL's search/query part will not be compared
     * @returns {boolean}
     */
    isSamePage: function (ignoreSearch) {
        var pageUrl = IrLib.Url.current();
        return (
        pageUrl.host == this.host &&
        pageUrl.protocol === this.protocol &&
        pageUrl.pathname === this.pathname &&
        (ignoreSearch || pageUrl.search === this.search)
        );
    },

    /**
     * Returns if the URL fully matches the current location
     *
     * @returns {boolean}
     */
    isCurrent: function () {
        return this.isEqualTo(IrLib.Url.current());
    },

    /**
     * Returns if the URL is equal to the given URL
     *
     * @param {String|IrLib.Url} url
     * @returns {boolean}
     */
    isEqualTo: function (url) {
        return ("" + url) == ("" + this);
    },

    /**
     * Returns a string representation of the URL object
     *
     * @returns {string}
     */
    toString: function () {
        return (this.protocol ? this.protocol + '//' : '') +
            this.host +
            this.pathname +
            this.search +
            this.hash;
    }
};






})(typeof exports === 'undefined'? this.IrLib = {}: exports);

// require('additional files')

