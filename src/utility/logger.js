/**
 * Created by COD on 14.04.15.
 */
var ef = function () {
};

var Logger = IrLib.Logger = (typeof console === 'object' ? console : {});

if (!Logger.log) {
    Logger.log = ef;
}
if (!Logger.debug) {
    Logger.debug = ef;
}
if (!Logger.info) {
    Logger.info = ef;
}
if (!Logger.warn) {
    Logger.warn = ef;
}
if (!Logger.error) {
    Logger.error = ef;
}
