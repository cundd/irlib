/**
 * Created by daniel on 05.07.15.
 */
IrLib.View.Parser = IrLib.View.Parser || {};

IrLib.View.Parser.ExpressionType = {
    UNKNOWN: 'UNK',

    VIEW: 'view',

    REPEATING_START: 'for',
    REPEATING_END: 'endfor',
    CONDITIONAL_START: 'if',
    CONDITIONAL_END: 'endif',

    ELSE: 'else',

    /**
     * Returns the keyword if it is a valid type, or UNKNOWN otherwise
     *
     * @param {string} keyword
     * @returns {string}
     */
    getTypeForKeyword: function(keyword) {
        return this.isKeyword(keyword) ? keyword : this.UNKNOWN;
    },

    /**
     * Returns if the given value is a valid type
     *
     * @param {string} keyword
     * @returns {Boolean}
     */
    isKeyword: function(keyword) {
        if (typeof keyword !== 'string') {
            return false;
        }
        var objectKeys = Object.keys(this),
            objectKeysLength = objectKeys.length;


        for (var i = 0; i < objectKeysLength; i++) {
            if (this[objectKeys[i]] === keyword) {
                return true;
            }
        }
        return false;
    }
};
