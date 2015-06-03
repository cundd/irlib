/**
 * Created by COD on 14.04.15.
 */
var _Error = IrLib.Error = function (message, code, userInfo) {
    this.message = message;
    this.code = code;
    this.userInfo = userInfo;
};

_Error.prototype = {
    toString: function() {
        return '[KungFu.Error] ' +
            (this.code ? '#' + this.code + ':' : '') +
            this.message;
    }
};