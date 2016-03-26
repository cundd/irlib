/**
 * Created by COD on 25.06.15.
 */
IrLib.View = IrLib.View || {};
/**
 * Defines a common interface for Views with variables
 *
 * @interface
 */
IrLib.View.VariableViewInterface = function () {
};
/**
 * Sets the variables
 *
 * @param {Object|IrLib.Dictionary} data
 * @returns {IrLib.View.Interface}
 */
IrLib.View.VariableViewInterface.prototype.setVariables = function (data) {
    throw new IrLib.MissingImplementationError('setVariables');
};
/**
 * Adds the variable with the given key and value
 *
 * @param {string} key
 * @param {*} value
 * @returns {IrLib.View.Interface}
 */
IrLib.View.VariableViewInterface.prototype.assignVariable = function (key, value) {
    throw new IrLib.MissingImplementationError('assignVariable');
};
/**
 * Returns the currently assigned variables
 *
 * @returns {IrLib.Dictionary}
 */
IrLib.View.VariableViewInterface.prototype.getVariables = function () {
    throw new IrLib.MissingImplementationError('getVariables');
};
//# sourceMappingURL=variable-view-interface.js.map