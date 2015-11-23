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
    registerMultiple: function (configuration) {
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
    resolveDependencies: function (instance, serviceClass) {
        if (serviceClass.prototype && typeof serviceClass.prototype.needs === 'object') {
            var dependencies = serviceClass.prototype.needs,
                dependenciesLength = dependencies.length,
                dependency, dependencyProperty, dependencyIdentifier, i;

            if (++this.recursionLevel > 1000) {
                throw new _Error('Maximum recursion level exceeded', 1434301204);
            }
            for (i = 0; i < dependenciesLength; i++) {
                dependency = dependencies[i].split(':', 2);
                dependencyIdentifier = dependency[0];
                dependencyProperty = (dependency[1] || dependencyIdentifier);
                instance[dependencyProperty] = this.get(dependencyIdentifier);
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
