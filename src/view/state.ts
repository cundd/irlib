/**
 * Created by COD on 25.06.15.
 */

IrLib.View = IrLib.View || {};

/**
 * Current template block information
 *
 * @param {Number} index
 * @param {Block[]} blockStream
 * @constructor
 */
IrLib.View.State = function (index, blockStream) {
    this.index = index|0;
    this.blockStream = blockStream;
};
