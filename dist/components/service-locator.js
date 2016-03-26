"use strict";
/**
 * Created by COD on 03.06.15.
 */
// var GeneralUtility = IrLib.Utility.GeneralUtility;
// var _Error = IrLib.Error;
var IrLib;
(function (IrLib) {
    var ServiceLocator = (function () {
        /**
         * Initialize the Service Locator
         */
        function ServiceLocator() {
            /**
             * @type {Object}
             */
            this.services = {};
            /**
             * @type {Object}
             */
            this.serviceFactory = {};
            /**
             * @type {Number}
             */
            this.recursionLevel = 0;
            this.set('serviceLocator', this);
        }
        /**
         * Register multiple factory/constructor-identifier combinations
         *
         * @param {Object} configuration
         * @returns {ServiceLocator}
         */
        ServiceLocator.prototype.registerMultiple = function (configuration) {
            var identifiers = Object.keys(configuration), identifier, i;
            for (i = 0; i < identifiers.length; i++) {
                identifier = identifiers[i];
                this.register(identifier, configuration[identifier]);
            }
            return this;
        };
        /**
         * Register the factory/constructor for the given service identifier
         *
         * @param {string} identifier
         * @param {Function} constructor
         * @returns {ServiceLocator}
         */
        ServiceLocator.prototype.register = function (identifier, constructor) {
            ServiceLocator._assertIdentifier(identifier);
            ServiceLocator._assertFactory(constructor);
            this.serviceFactory[identifier] = constructor;
            return this;
        };
        /**
         * Sets the instance for the given service identifier
         *
         * @param {string} identifier
         * @param {Object} instance
         * @returns {ServiceLocator}
         */
        ServiceLocator.prototype.set = function (identifier, instance) {
            ServiceLocator._assertIdentifier(identifier);
            this.services[identifier] = instance;
            return this;
        };
        /**
         * Returns the instance for the given service identifier
         *
         * If a service instance for the given identifier is already registered, it will be returned. If no instance is
         * found a matching service factory is looked up. If none is found an exception will be thrown
         *
         * @param {string} identifier
         * @returns {Object}
         */
        ServiceLocator.prototype.get = function (identifier) {
            ServiceLocator._assertIdentifier(identifier);
            var instance = this.services[identifier];
            if (!instance) {
                instance = this.create(identifier);
                this.set(identifier, instance);
            }
            return instance;
        };
        /**
         * Creates a new instance for the given service identifier and will invoke didResolveDependencies if it exists
         *
         * @param {string} identifier
         * @param {*} [additionalArgument]
         * @returns {Object}
         */
        ServiceLocator.prototype.create = function (identifier, additionalArgument) {
            if (additionalArgument === void 0) { additionalArgument = null; }
            ServiceLocator._assertIdentifier(identifier);
            var withArgument = arguments.length > 1, instance, _serviceFactoryCallback;
            if (arguments.length > 2) {
                throw new Error('Too many arguments');
            }
            _serviceFactoryCallback = this.serviceFactory[identifier];
            if (!_serviceFactoryCallback) {
                throw new Error('Could not find service with identifier ' + identifier);
            }
            if (_serviceFactoryCallback.prototype && _serviceFactoryCallback.prototype.constructor) {
                instance = this.resolveDependencies(withArgument ? new _serviceFactoryCallback(additionalArgument) : new _serviceFactoryCallback(), _serviceFactoryCallback);
            }
            else {
                instance = withArgument ? _serviceFactoryCallback(additionalArgument) : _serviceFactoryCallback();
            }
            if (typeof instance.didResolveDependencies === 'function') {
                instance.didResolveDependencies();
            }
            return instance;
        };
        /**
         * Resolves the dependencies defined in the prototype's "needs" property
         *
         * @param {Object} instance
         * @param {Object} serviceClass
         * @returns {Object}
         */
        ServiceLocator.prototype.resolveDependencies = function (instance, serviceClass) {
            if (serviceClass.prototype && typeof serviceClass.prototype.needs === 'object') {
                var dependencies = serviceClass.prototype.needs, dependenciesLength = dependencies.length, dependency, dependencyProperty, dependencyIdentifier, i;
                if (++this.recursionLevel > 1000) {
                    throw new Error('Maximum recursion level exceeded');
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
        };
        /**
         * Tests if the given name is a valid service identifier
         *
         * @param {*} identifier
         * @private
         */
        ServiceLocator._assertIdentifier = function (identifier) {
            if (typeof identifier !== 'string') {
                throw new Error('Given service name is not of type string');
            }
        };
        /**
         * Tests if the given value is a valid service factory
         *
         * @param {*} constructor
         * @private
         */
        ServiceLocator._assertFactory = function (constructor) {
            if (typeof constructor !== 'function') {
                throw new Error('Given service constructor is not callable');
            }
        };
        return ServiceLocator;
    }());
})(IrLib = exports.IrLib || (exports.IrLib = {}));
//# sourceMappingURL=service-locator.js.map