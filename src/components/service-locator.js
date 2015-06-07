/**
 * Created by COD on 03.06.15.
 */

var GeneralUtility = IrLib.Utility.GeneralUtility;
var _Error = IrLib.Error;
IrLib.ServiceLocator = IrLib.CoreObject.extend({
    /**
     * @type {Object}
     */
    services: {},

    /**
     * @type {Object}
     */
    serviceFactory: {},

    /**
     * Initialize the Service Locator
     */
    init: function () {
        this.set('serviceLocator', this);

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
                instance = new _serviceFactoryCallback();
            } else {
                instance = _serviceFactoryCallback();
            }
            this.set(identifier, instance);
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