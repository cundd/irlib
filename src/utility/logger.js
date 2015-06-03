/**
 * Created by COD on 14.04.15.
 */
var ef = function() {};
var Logger = IrLib.Logger = console || {};

if (!Logger.debug) {
    Logger.debug = ef;
}
if (!Logger.info) {
    Logger.info = ef;
}
if (!Logger.warn) {
    Logger.warn = ef;
}
