/**
 * Created by COD on 03.06.15.
 */
require('class');

IrLib.CoreObject = Class.extend({
    /**
     * @type {String}
     */
    __guid: null,

    /**
     * Returns the global unique ID of the object
     *
     * @returns {String}
     */
    guid: function () {
        if (!this.__guid) {
            this.__guid = 'irLib-' + (++IrLib.CoreObject.__lastGuid);
        }
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
     * Returns a deep copy of this object
     *
     * @returns {*}
     */
    clone: function() {
        return IrLib.Utility.GeneralUtility.clone(this, 1);
    }
});
IrLib.CoreObject.__lastGuid = 0;
