/**
 * Created by COD on 03.06.15.
 */
require('class');

IrLib.CoreObject = Class.extend({
    /**
     * @type {String}
     */
    __guid: null,

    init: function() {
        this.__guid = IrLib.CoreObject.createGuid();
    },

    /**
     * Returns the global unique ID of the object
     *
     * @returns {String}
     */
    guid: function () {
        return this.__guid;
    },

    /**
     * Defines a new property with the given key and descriptor
     *
     * @param {String} key
     * @param {Object} descriptor
     * @returns {IrLib.CoreObject}
     * @see Object.defineProperty()
     */
    defineProperty: function (key, descriptor) {
        if (descriptor.overwrite === false && this[key]) {
            return this;
        }
        Object.defineProperty(this, key, descriptor);
        return this;
    },

    /**
     * Defines new properties form the given properties
     *
     * @param {Object} properties
     * @returns {IrLib.CoreObject}
     * @see Object.defineProperties()
     */
    defineProperties: function (properties) {
        Object.defineProperties(this, properties);
        return this;
    },

    /**
     * Returns a clone of this object
     *
     * @returns {*}
     */
    clone: function() {
        var source = this,
            _clone = new (source.constructor)();
        for (var attr in source) {
            if (source.hasOwnProperty(attr)) {
                _clone[attr] = source[attr];
            }
        }
        _clone.__guid = IrLib.CoreObject.createGuid();
        return _clone;
    }
});
IrLib.CoreObject.__lastGuid = 0;
IrLib.CoreObject.createGuid = function() {
    return 'irLib-' + (++IrLib.CoreObject.__lastGuid);
};
