/**
 * Created by COD on 03.06.15.
 */

export default class CoreObject {
    __guid:string;
    static __lastGuid:number = 0;


    constructor() {
        this.__guid = CoreObject.createGuid();
    }

    /**
     * Returns the global unique ID of the object
     *
     * @returns {string}
     */
    guid() {
        return this.__guid;
    }

    /**
     * Defines a new property with the given key and descriptor
     *
     * @param {string} key
     * @param {Object} descriptor
     * @returns {CoreObject}
     * @see Object.defineProperty()
     */
    defineProperty(key:string, descriptor:PropertyDescriptor) {
        if (descriptor['overwrite'] === false && this[key]) {
            return this;
        }
        Object.defineProperty(this, key, descriptor);
        return this;
    }

    /**
     * Defines new properties form the given properties
     *
     * @param {PropertyDescriptorMap} properties
     * @returns {CoreObject}
     * @see Object.defineProperties()
     */
    defineProperties(properties:PropertyDescriptorMap) {
        Object.defineProperties(this, properties);
        return this;
    }

    /**
     * Returns a clone of this object
     *
     * @returns {*}
     */
    clone() {
        var _clone = new (<any>this.constructor()),
            source = this;
        for (var attr in source) {
            if (source.hasOwnProperty(attr)) {
                _clone[attr] = source[attr];
            }
        }
        _clone.__guid = CoreObject.createGuid();
        return _clone;
    }

    /**
     * Creates a callback function with bound this
     *
     * @param {Function|string} method
     * @returns {Function}
     */
    bind(method):Function {
        var _this = this,
            impl;

        if (typeof method === 'function') {
            impl = method;
        } else if (typeof _this[method] === 'function') {
            impl = _this[method];
        } else {
            throw new Error('Argument method must be either a method name or a function');
        }

        return function () {
            var __preparedArguments = Array.prototype.slice.call(arguments);
            __preparedArguments.push(this);
            return impl.apply(_this, __preparedArguments);
        };
    }

    static createGuid():string {
        return 'irLib-' + (++CoreObject.__lastGuid);
    }
}

