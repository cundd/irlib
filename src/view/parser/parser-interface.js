/**
 * Created by COD on 25.06.15.
 */

/**
 * @abstract
 * @type {{}}
 */
IrLib.View.Template = IrLib.View.Template || {};

/**
 * Interface for template parsers
 *
 * @interface
 */
IrLib.View.Template.ParserInterface = IrLib.CoreObject.extend({
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
