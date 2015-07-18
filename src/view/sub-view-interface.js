/**
 * Created by COD on 25.06.15.
 */

IrLib.View = IrLib.View || {};

/**
 * Defines the interface for Views that can be used as subview inside another View
 *
 * @interface
 */
IrLib.View.SubViewInterface = function () {
};

/**
 * Returns the string representation of the rendered template
 *
 * @returns {String}
 */
IrLib.View.SubViewInterface.prototype.toString = function () {
    throw new IrLib.MissingImplementationError('toString');
};
