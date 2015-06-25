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
     * @return {String}
     */
    render: function () {
    },

    /**
     * Set the variables
     *
     * @param {Object|IrLib.Dictionary} data
     */
    setVariables: function (data) {
    },

    /**
     * Add the variable with the given key and value
     *
     * @param {String} key
     * @param {*} value
     */
    assignVariable: function (key, value) {
    }
});
