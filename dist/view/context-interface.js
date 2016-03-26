/**
 * Created by COD on 25.06.15.
 */
IrLib.View = IrLib.View || {};
/**
 * Defines a common interface for context aware Views
 *
 * @interface
 */
IrLib.View.ContextInterface = function () {
};
IrLib.View.ContextInterface.prototype.setContext = function () {
    throw new IrLib.MissingImplementationError('setContext');
};
IrLib.View.ContextInterface.prototype.getContext = function () {
    throw new IrLib.MissingImplementationError('getContext');
};
//# sourceMappingURL=context-interface.js.map