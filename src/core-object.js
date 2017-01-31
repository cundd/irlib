/**
 * Created by COD on 03.06.15.
 */
require('class');

export default class CoreObject {
    /**
     * @type {number}
     * @private
     */
    static __lastGuid = 0;

    /**
     * Builds a new UID
     * @returns {string}
     */
    static createGuid = function () {
        return 'irLib-' + (++CoreObject.__lastGuid);
    };

    constructor() {
        this.__guid = CoreObject.createGuid();
        this.init();
    }

    /**
     * Returns the global unique ID of the object
     *
     * @returns {String}
     */
    guid() {
        return this.__guid;
    }

    /**
     * Defines a new property with the given key and descriptor
     *
     * @param {String} key
     * @param {Object} descriptor
     * @returns {CoreObject}
     * @see Object.defineProperty()
     */
    defineProperty(key, descriptor) {
        if (descriptor.overwrite === false && this[key]) {
            return this;
        }
        Object.defineProperty(this, key, descriptor);
        return this;
    }

    /**
     * Defines new properties form the given properties
     *
     * @param {Object} properties
     * @returns {CoreObject}
     * @see Object.defineProperties()
     */
    defineProperties(properties) {
        Object.defineProperties(this, properties);
        return this;
    }

    /**
     * Returns a clone of this object
     *
     * @returns {CoreObject}
     */
    clone() {
        const source = this;
        const _clone = new (source.constructor)();
        for (let attr in source) {
            if (source.hasOwnProperty(attr)) {
                _clone[attr] = source[attr];
            }
        }
        _clone.__guid = IrLib.CoreObject.createGuid();

        return _clone;
    }

    /**
     * Creates a callback function with bound this
     *
     * @param {Function|String} method
     * @returns {Function}
     */
    bind(method) {
        const _this = this;
        let impl;

        if (typeof method === 'function') {
            impl = method;
        } else if (typeof _this[method] === 'function') {
            impl = _this[method];
        } else {
            throw new IrLib.Error('Argument method must be either a method name or a function');
        }

        return function () {
            const __preparedArguments = Array.prototype.slice.call(arguments);
            __preparedArguments.push(this);
            return impl.apply(_this, __preparedArguments);
        };
    }
}
