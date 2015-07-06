/**
 * Created by daniel on 05.07.15.
 */
IrLib.View.Parser = IrLib.View.Parser || {};

/**
 * Definition of a template block
 *
 * @param {String} type Block type as one of the BlockType constants
 * @param {String} content Inner content of the block
 * @param {Object} [meta] Metadata needed to render this block
 * @constructor
 */
IrLib.View.Parser.Block = function(type, content, meta) {
    this.type = type;
    this.content = content;
    this.meta = meta || {};
};
