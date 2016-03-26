/**
 * Created by daniel on 05.07.15.
 */
IrLib.View.Parser = IrLib.View.Parser || {};

/**
 * Definition of a template block
 *
 * @param {string} type Block type as one of the BlockType constants
 * @param {string} content Inner content of the block
 * @param {Object} [meta] Metadata needed to render this block
 * @constructor
 */
IrLib.View.Parser.Block = function(type, content, meta) {
    this.type = type;
    this.content = content;
    this.meta = meta || {};
};
