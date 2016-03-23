/**
 * Created by COD on 22.03.16.
 */
/**
 * Created by COD on 14.04.15.
 */
var _Error = IrLib.TypeError = function (message, code, userInfo) {
    this.message = message;
    this.code = code;
    this.userInfo = userInfo;
};

_Error.prototype = Object.create(TypeError.prototype);
_Error.prototype = {
    constructor: _Error,
    toString: function() {
        return '[IrLib.TypeError] ' +
            (this.code ? '#' + this.code + ':' : '') +
            this.message;
    }
};
