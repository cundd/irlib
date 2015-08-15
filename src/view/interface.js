/**
 * Created by COD on 25.06.15.
 */

IrLib.View = IrLib.View || {};

/**
 * Defines a common interface for Views
 *
 * @implements IrLib.View.SubViewInterface
 * @interface
 */
IrLib.View.Interface = IrLib.CoreObject.extend({
    init: function (template, variables) {
    },

    /**
     * Renders the template
     *
     * @return {Node|HTMLElement}
     * @abstract
     */
    render: function () {
        throw new IrLib.MissingImplementationError('render');
    },

    /**
     * Set the variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @return {IrLib.View.Interface}
     * @abstract
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
     * @abstract
     */
    assignVariable: function (key, value) {
        throw new IrLib.MissingImplementationError('assignVariable');
    },

    /**
     * Appends the View to the given DOM element, while replacing the previously rendered element
     *
     * @param {Node|HTMLElement} element
     * @return {IrLib.View.Interface}
     * @abstract
     */
    appendTo: function (element) {
        throw new IrLib.MissingImplementationError('appendTo');
    },

    /**
     * Removes the element from it's parent
     *
     * @returns {IrLib.View.Interface}
     * @abstract
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
     * @abstract
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
     * @abstract
     */
    dispatchEvent: function (event) {
        throw new IrLib.MissingImplementationError('dispatchEvent');
    },

    /**
     * Returns the string representation of the rendered template
     *
     * @returns {String}
     * @abstract
     */
    toString: function () {
        throw new IrLib.MissingImplementationError('toString');
    }
});
