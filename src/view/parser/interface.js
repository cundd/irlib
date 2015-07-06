/**
 * Created by COD on 25.06.15.
 */

IrLib.View.Parser = IrLib.View.Parser || {};

/**
 * Interface for template parsers
 *
 * @interface
 */
IrLib.View.Parser.Interface = IrLib.CoreObject.extend({
    /**
     * Parses the given input string and returns a sequence of Blocks
     *
     * @param {String} input
     * @return {Block[]}
     */
    parse: function(input) {
        throw new IrLib.MissingImplementationError('parse');
    }
});
