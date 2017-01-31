/**
 * Created by COD on 14.04.15.
 */
export default class MissingImplementationError extends Error {
    constructor(message, code) {
        super(message, code || 1435238939);
    }

    toString() {
        return '[IrLib.MissingImplementationError] ' +
            (this.code ? '#' + this.code + ':' : '') +
            this.message;
    }
}
