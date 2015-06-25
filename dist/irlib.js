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
 *
 * Edited by Daniel Corn
 */
// jshint ignore: start
// Inspired by base2 and Prototype
(function(root){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    //var hasUnderscoreJs = root['_'] && root._['clone'];
    //var hasJQuery = root['jQuery'] && root.jQuery().jquery;
    //
    //var simpleClone = function(source, isDeep) {
    //    var target = {};
    //    for (var prop in source) {
    //        if (!source.hasOwnProperty(prop)) {
    //            console.log('skip: ' + prop)
    //            continue;
    //        }
    //        if (source[prop] instanceof Date) {
    //            console.log('copy: Date ' + prop);
    //            target[prop] = source[prop];
    //
    //            continue;
    //
    //        }
    //        if (isDeep && typeof source[prop] === 'object') {
    //            target[prop] = simpleClone(target[prop], source[prop]);
    //        } else {
    //            target[prop] = source[prop];
    //        }
    //    }
    //    return target;
    //};
    //var createLocalProperty = function(source) {
    //    if (!source) {
    //        return source;
    //    }
    //    if (typeof source === 'object') {
    //        console.log('is object');
    //        if (hasJQuery) {
    //            return jQuery.extend({}, source);
    //        }
    //        if (hasUnderscoreJs) {
    //            return _.clone(source)
    //        }
    //        return simpleClone(source, false);
    //    }
    //    return source;
    //};

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
            //if (typeof prop[name] === 'object') {
            //    IrLib.Logger.warn(
            //        'Detected object type prototype member "' + name + '". ' +
            //        'You should initialize member objects inside init()'
            //    );
            //}
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
                //createLocalProperty(prop[name]);
                //(typeof prop[name] === 'object' ? simpleClone(prop[name]) : prop[name]);
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
})(this);





IrLib.CoreObject = Class.extend({
});




/*    require('error\/*');// */

/**
 * Created by COD on 14.04.15.
 */
var _Error = IrLib.Error = function (message, code, userInfo) {
    this.message = message;
    this.code = code;
    this.userInfo = userInfo;
};

_Error.prototype = Object.create(Error.prototype);
_Error.prototype = {
    constructor: _Error,
    toString: function() {
        return '[IrLib.Error] ' +
            (this.code ? '#' + this.code + ':' : '') +
            this.message;
    }
};


/**
 * Created by COD on 14.04.15.
 */
IrLib.MissingImplementationError = function (message, code) {
    this.message = message;
    this.code = code || 1435238939;
};

IrLib.MissingImplementationError.prototype = Object.create(Error.prototype);
IrLib.MissingImplementationError.prototype = {
    constructor: IrLib.MissingImplementationError,
    toString: function() {
        return '[IrLib.MissingImplementationError] ' +
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
    },

    /**
     * Tries to transform the given value into an array
     *
     * If the value is
     * - undefined an empty array will be returned
     * - an array it will be cloned and returned (the elements will not be cloned)
     * - an object it's values will be returned
     * - something else a new array will be returned with the value as it's single element
     *
     * @param {*} value
     * @returns {*}
     */
    toArray: function(value) {
        if (typeof value === 'undefined') {
            return [];
        }
        if (value instanceof Array) {
            return value.slice();
        }
        if (typeof value === 'object') {
            var valueCollection = [],
                keys = Object.keys(value),
                keysLength = keys.length;
            for (var i = 0; i < keysLength; i++) {
                valueCollection.push(value[keys[i]]);
            }
            return valueCollection;
        }
        return [value];
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
     * Handle the DOM event
     *
     * @param {Event} event
     */
    handleEvent: function(event) {
        var _events = this.events;
        if (_events[event.type]) {
            _events[event.type].call(this, event);
        } else {
            console.log(event);
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
        if (!GeneralUtility.domNode(view)) {
            throw new _Error('No view given', 1433355412, view);
        }
    },

    /**
     * Registered event handler methods
     */
    events: {

    }
});

/**
 * Created by COD on 25.06.15.
 */
var _Error = IrLib.Error;
IrLib.Dictionary = IrLib.CoreObject.extend({
    /**
     * Initialize the Service Locator
     */
    init: function (initializationValues) {
        /**
         * Initialize the instance with the keys and values from the given object
         *
         * @param initializationValues
         * @returns {IrLib.Dictionary}
         * @private
         */
        var _initWithObject = function (initializationValues) {
            var keys = Object.keys(initializationValues),
                keysLength = keys.length,
                currentKey;
            for (var i = 0; i < keysLength; i++) {
                currentKey = keys[i];
                this[currentKey] = initializationValues[currentKey];
            }
        };

        if (arguments.length > 0) {
            if (typeof initializationValues !== 'object') {
                throw new _Error(
                    'Initialization argument has to be of type object, ' + (typeof initializationValues) + ' given',
                    1435219260
                );
            }
            _initWithObject.call(this, initializationValues);
        }
        return this;
    },

    /**
     * Returns the dictionary's values as array
     *
     * @returns {Array}
     */
    values: function () {
        var valueCollection = [],
            keys = this.keys(),
            keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            valueCollection.push(this[keys[i]]);
        }
        return valueCollection;
    },

    /**
     * Returns the dictionary's keys as array
     *
     * @returns {Array}
     */
    keys: function () {
        return Object.keys(this);
    },

    /**
     * Invokes the callback for each key value pair in the Dictionary, passing in the value, key and dictionary
     *
     * Callback schema: function(value, key, dictionary) {}
     *
     * @param {Function} callback
     * @param {Object} [thisArg]
     */
    forEach: function(callback, thisArg) {
        this.map(callback, thisArg);
    },

    /**
     * Creates a new array with the results of invoking the given callback for each key value pair in the Dictionary.
     *
     * Callback schema: function(value, key, dictionary) { return newValue; }
     *
     * @param {Function} callback
     * @param {Object} [thisArg]
     */
    map: function(callback, thisArg) {
        if (typeof callback !== 'function') {
            throw new TypeError('Argument "callback" is not of type function');
        }
        var valueCollection = [],
            keys = this.keys(),
            keysLength = keys.length,
            preparedCallback = callback,
            currentKey, currentValue;

        if (thisArg) {
            preparedCallback = callback.bind(thisArg);
        }

        for (var i = 0; i < keysLength; i++) {
            currentKey = keys[i];
            currentValue = this[currentKey];
            valueCollection.push(preparedCallback(currentValue, currentKey, this));
        }
        return valueCollection;
    }
});


/**
 * Created by COD on 03.06.15.
 */

var GeneralUtility = IrLib.Utility.GeneralUtility;
var _Error = IrLib.Error;
IrLib.ServiceLocator = IrLib.CoreObject.extend({
    /**
     * @type {Object}
     */
    services: null,

    /**
     * @type {Object}
     */
    serviceFactory: null,

    /**
     * @type {Number}
     */
    recursionLevel: 0,

    /**
     * Initialize the Service Locator
     */
    init: function () {
        this.services = {};
        this.serviceFactory = {};

        this.set('serviceLocator', this);
    },

    /**
     * Register multiple factory/constructor-identifier combinations
     *
     * @param {Object} configuration
     * @returns {IrLib.ServiceLocator}
     */
    registerMultiple: function(configuration) {
        var identifiers = Object.keys(configuration),
            identifier, i;
        for (i = 0; i < identifiers.length; i++) {
            identifier = identifiers[i];
            this.register(identifier, configuration[identifier]);
        }
        return this;
    },

    /**
     * Register the factory/constructor for the given service identifier
     *
     * @param {String} identifier
     * @param {Function} constructor
     * @returns {IrLib.ServiceLocator}
     */
    register: function (identifier, constructor) {
        this._assertIdentifier(identifier);
        this._assertFactory(constructor);

        this.serviceFactory[identifier] = constructor;
        return this;
    },

    /**
     * Sets the instance for the given service identifier
     *
     * @param {String} identifier
     * @param {Object} instance
     * @returns {IrLib.ServiceLocator}
     */
    set: function (identifier, instance) {
        this._assertIdentifier(identifier);

        this.services[identifier] = instance;
        return this;
    },

    /**
     * Returns the instance for the given service identifier
     *
     * If a service instance for the given identifier is already registered, it will be returned. If no instance is
     * found a matching service factory is looked up. If none is found an exception will be thrown
     *
     * @param {String} identifier
     * @returns {Object}
     */
    get: function (identifier) {
        this._assertIdentifier(identifier);

        var instance = this.services[identifier],
            _serviceFactoryCallback;
        if (!instance) {
            _serviceFactoryCallback = this.serviceFactory[identifier];
            if (!_serviceFactoryCallback) {
                throw new _Error('Could not find service with identifier ' + identifier);
            }
            if (_serviceFactoryCallback.prototype && _serviceFactoryCallback.prototype.constructor) {
                instance = this.resolveDependencies(
                    new _serviceFactoryCallback(),
                    _serviceFactoryCallback
                );
            } else {
                instance = _serviceFactoryCallback();
            }
            this.set(identifier, instance);
        }
        return instance;
    },

    /**
     * Resolves the dependencies defined in the prototype's "needs" property
     *
     * @param {Object} instance
     * @param {Class} serviceClass
     * @returns {Object}
     */
    resolveDependencies: function(instance, serviceClass) {
        if (serviceClass.prototype && typeof serviceClass.prototype.needs === 'object') {
            var dependencies = serviceClass.prototype.needs,
                dependency, i;

            if (++this.recursionLevel > 100) {
                throw new _Error('Maximum recursion level exceeded', 1434301204);
            }
            for (i = 0; i < dependencies.length; i++) {
                dependency = dependencies[i];
                instance[dependency] = this.get(dependency);
            }
            this.recursionLevel--;
        }
        return instance;
    },

    /**
     * Tests if the given name is a valid service identifier
     *
     * @param {*} identifier
     * @private
     */
    _assertIdentifier: function (identifier) {
        if (typeof identifier !== 'string') {
            throw new _Error('Given service name is not of type string', 1433683510);
        }
    },

    /**
     * Tests if the given value is a valid service factory
     *
     * @param {*} constructor
     * @private
     */
    _assertFactory: function (constructor) {
        if (typeof constructor !== 'function') {
            throw new _Error('Given service constructor is not callable', 1433683511);
        }
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





/*    require('view\/interface');// */




/*    require('view\/*');// */

/**
 * Created by COD on 25.06.15.
 */

IrLib.View = IrLib.View || {};

/**
 * Defines a common interface for Views
 */
IrLib.View.Interface = IrLib.CoreObject.extend({
    /**
     * Renders the template
     *
     * @return {Node|HTMLElement}
     */
    render: function () {
        throw new IrLib.MissingImplementationError('render');
    },

    /**
     * Set the variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @return {IrLib.View.Interface}
     */
    setVariables: function (data) {
        throw new IrLib.MissingImplementationError('setVariables');
    },

    /**
     * Add the variable with the given key and value
     *
     * @param {String} key
     * @param {*} value
     * @return {IrLib.View.Interface}
     */
    assignVariable: function (key, value) {
        throw new IrLib.MissingImplementationError('assignVariable');
    },

    /**
     * Appends the View to the given DOM element, while replacing the previously rendered element
     *
     * @param {Node|HTMLElement} element
     * @return {IrLib.View.Interface}
     */
    appendTo: function(element) {
        throw new IrLib.MissingImplementationError('appendTo');
    },

    /**
     * Removes the element from it's parent
     *
     * @returns {IrLib.View.Interface}
     */
    remove: function() {
        throw new IrLib.MissingImplementationError('remove');
    }
});


/**
 * Created by COD on 25.06.15.
 */

/**
 * A template based view
 */
IrLib.View.Template = IrLib.View.Interface.extend({
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
            this._template = template;
        }
        this.setVariables(variables || {});
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
        if (typeof element.appendChild !== 'function') {
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
    }
});





})(typeof exports === 'undefined'? this.IrLib = {}: exports);

// require('additional files')

