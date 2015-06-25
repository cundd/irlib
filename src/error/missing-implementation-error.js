/**
 * Created by COD on 14.04.15.
 */
IrLib.MissingImplementationError = function (message, code) {
    this.message = message;
    this.code = code || 1435238939;
};

IrLib.MissingImplementationError.prototype = Object.create(Error.prototype);
IrLib.MissingImplementationError.prototype = {
    constructor: IrLib.MissingImplementationError,
    toString: function() {
        return '[IrLib.MissingImplementationError] ' +
            (this.code ? '#' + this.code + ':' : '') +
            this.message;
    }
};