/**
 * Created by COD on 03.06.15.
 */
"use strict";
var CoreObject = (function () {
    function CoreObject() {
        this.__guid = CoreObject.createGuid();
    }
    /**
     * Returns the global unique ID of the object
     *
     * @returns {string}
     */
    CoreObject.prototype.guid = function () {
        return this.__guid;
    };
    /**
     * Defines a new property with the given key and descriptor
     *
     * @param {string} key
     * @param {Object} descriptor
     * @returns {CoreObject}
     * @see Object.defineProperty()
     */
    CoreObject.prototype.defineProperty = function (key, descriptor) {
        if (descriptor['overwrite'] === false && this[key]) {
            return this;
        }
        Object.defineProperty(this, key, descriptor);
        return this;
    };
    /**
     * Defines new properties form the given properties
     *
     * @param {PropertyDescriptorMap} properties
     * @returns {CoreObject}
     * @see Object.defineProperties()
     */
    CoreObject.prototype.defineProperties = function (properties) {
        Object.defineProperties(this, properties);
        return this;
    };
    /**
     * Returns a clone of this object
     *
     * @returns {*}
     */
    CoreObject.prototype.clone = function () {
        var _clone = new (this.constructor()), source = this;
        for (var attr in source) {
            if (source.hasOwnProperty(attr)) {
                _clone[attr] = source[attr];
            }
        }
        _clone.__guid = CoreObject.createGuid();
        return _clone;
    };
    /**
     * Creates a callback function with bound this
     *
     * @param {Function|string} method
     * @returns {Function}
     */
    CoreObject.prototype.bind = function (method) {
        var _this = this, impl;
        if (typeof method === 'function') {
            impl = method;
        }
        else if (typeof _this[method] === 'function') {
            impl = _this[method];
        }
        else {
            throw new Error('Argument method must be either a method name or a function');
        }
        return function () {
            var __preparedArguments = Array.prototype.slice.call(arguments);
            __preparedArguments.push(this);
            return impl.apply(_this, __preparedArguments);
        };
    };
    CoreObject.createGuid = function () {
        return 'irLib-' + (++CoreObject.__lastGuid);
    };
    CoreObject.__lastGuid = 0;
    return CoreObject;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoreObject;
//# sourceMappingURL=core-object.js.map