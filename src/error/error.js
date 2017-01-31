/**
 * Created by COD on 14.04.15.
 */
export default class IrError extends Error {
    constructor(message, code, userInfo = undefined) {
        super(message, code || 1435238939);
        this.userInfo = userInfo;
    }

    toString() {
        return '[IrLib.Error] ' +
            (this.code ? '#' + this.code + ':' : '') +
            this.message;
    }
}
