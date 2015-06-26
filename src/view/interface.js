/**
 * Created by COD on 25.06.15.
 */

IrLib.View = IrLib.View || {};

/**
 * Defines a common interface for Views
 *
 * @interface
 */
IrLib.View.Interface = IrLib.CoreObject.extend({
    /**
     * Renders the template
     *
     * @return {Node|HTMLElement}
     */
    render: function () {
        throw new IrLib.MissingImplementationError('render');
    },

    /**
     * Set the variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @return {IrLib.View.Interface}
     */
    setVariables: function (data) {
        throw new IrLib.MissingImplementationError('setVariables');
    },

    /**
     * Add the variable with the given key and value
     *
     * @param {String} key
     * @param {*} value
     * @return {IrLib.View.Interface}
     */
    assignVariable: function (key, value) {
        throw new IrLib.MissingImplementationError('assignVariable');
    },

    /**
     * Appends the View to the given DOM element, while replacing the previously rendered element
     *
     * @param {Node|HTMLElement} element
     * @return {IrLib.View.Interface}
     */
    appendTo: function (element) {
        throw new IrLib.MissingImplementationError('appendTo');
    },

    /**
     * Removes the element from it's parent
     *
     * @returns {IrLib.View.Interface}
     */
    remove: function () {
        throw new IrLib.MissingImplementationError('remove');
    },

    /**
     * Adds the given event listener to the View
     *
     * @param {String} type
     * @param {EventListener|Function} listener
     * @param {Boolean} [useCapture]
     */
    addEventListener: function (type, listener, useCapture) {
        throw new IrLib.MissingImplementationError('addEventListener');
    },

    /**
     * Dispatches an Event at the View, invoking the affected EventListeners in the appropriate order.
     *
     * The normal event processing rules (including the capturing and optional bubbling phase) apply to events
     * dispatched manually with dispatchEvent().
     *
     * @param {Event} event
     * @return {Boolean}
     */
    dispatchEvent: function (event) {
        throw new IrLib.MissingImplementationError('dispatchEvent');
    }
});
