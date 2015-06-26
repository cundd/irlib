/**
 * Created by COD on 03.06.15.
 */
require('class');

IrLib.CoreObject = Class.extend({
    /**
     * @type {Number}
     */
    __guid: null,

    /**
     * Returns the global unique ID of the object
     *
     * @returns {Number}
     */
    guid: function() {
        if (!this.__guid) {
            this.__guid = 'irLib-' + (++IrLib.CoreObject.__lastGuid);
        }
        return this.__guid;
    }
});
IrLib.CoreObject.__lastGuid = 0;
