/**
 * Created by COD on 25.06.15.
 */
require('view/parser/interface');

/**
 * Template Parser implementation
 */
IrLib.View.Parser.Parser = IrLib.View.Parser.Interface.extend({
    /**
     * Start character of a block
     */
    BLOCK_START_CHAR: '{',

    /**
     * End character of a block
     */
    BLOCK_END_CHAR: '}',

    /**
     * Number the block start and end characters have to occur to build an un-save block
     */
    BLOCK_DELIMITER_REPEAT_NO_SAVE: 2,

    /**
     * Number the block start and end characters have to occur to build an save block
     */
    BLOCK_DELIMITER_REPEAT_SAVE: 3,

    /**
     * Regular expression to match variable blocks
     */
    PATTERN_VARIABLE: /^\{{2,3}[a-zA-Z0-9\-_\.]+}{2,3}$/,

    /**
     * Parses the given input string and returns a sequence of Blocks
     *
     * @param {String} input
     * @return {Block[]}
     */
    parse: function (input) {
        if (typeof input !== 'string') {
            throw new TypeError(
                'Expected argument "input" to be of type string, ' + (typeof input) + ' given',
                1436105669
            );
        }

        var tokens = this._tokenize(input);
        return this._analyze(tokens);
    },

    /**
     * Analyzes and classifies the tokens
     *
     * @param {String[]} tokens
     * @return {Block[]}
     * @private
     */
    _analyze: function (tokens) {
        var Block = IrLib.View.Parser.Block,
            BlockType = IrLib.View.Parser.BlockType,
            _PATTERN_VARIABLE = this.PATTERN_VARIABLE,
            _BLOCK_START_CHAR = this.BLOCK_START_CHAR,
            _BLOCK_END_CHAR = this.BLOCK_END_CHAR,
            _BLOCK_DELIMITER_REPEAT_NO_SAVE = this.BLOCK_DELIMITER_REPEAT_NO_SAVE,
            _BLOCK_DELIMITER_REPEAT_SAVE = this.BLOCK_DELIMITER_REPEAT_SAVE,
            blockStartString = new Array(_BLOCK_DELIMITER_REPEAT_NO_SAVE + 1).join(_BLOCK_START_CHAR),
            blockEndString = new Array(_BLOCK_DELIMITER_REPEAT_NO_SAVE + 1).join(_BLOCK_END_CHAR),
            tokensLength = tokens.length,
            blocks = [],
            startsWithBlockStart,
            currentToken,
            currentTokenLength,
            currentContent,
            i;

        for (i = 0; i < tokensLength; i++) {
            currentToken = tokens[i];
            currentTokenLength = currentToken.length;

            // Don't check for brackets for tokens that are too short
            if (currentTokenLength > 2) {
                startsWithBlockStart = currentToken.substr(0, _BLOCK_DELIMITER_REPEAT_NO_SAVE) === blockStartString;
            } else {
                startsWithBlockStart = false;
            }

            if (startsWithBlockStart && _PATTERN_VARIABLE.test(currentToken)) {
                currentContent = currentToken.substring(
                    _BLOCK_DELIMITER_REPEAT_NO_SAVE,
                    currentTokenLength - _BLOCK_DELIMITER_REPEAT_NO_SAVE
                );

                var contentFirstCharacterIsBlockStart = currentContent.charAt(0) === _BLOCK_START_CHAR;
                if (
                    contentFirstCharacterIsBlockStart &&
                    (currentContent.charAt(
                        currentTokenLength - _BLOCK_DELIMITER_REPEAT_NO_SAVE - _BLOCK_DELIMITER_REPEAT_NO_SAVE - 1
                    ) === _BLOCK_END_CHAR)
                ) { // Case 1 = save: {{{varName}}}
                    blocks[i] = new Block(
                        BlockType.VARIABLE,
                        currentToken.substring(_BLOCK_DELIMITER_REPEAT_SAVE, currentTokenLength - _BLOCK_DELIMITER_REPEAT_SAVE),
                        {isSave: true}
                    );
                } else if (contentFirstCharacterIsBlockStart) { // Case 2 = invalid: {{varName}
                    blocks[i] = new Block(BlockType.STATIC, currentToken);
                } else { // Case 3 = not save: {{varName}}
                    blocks[i] = new Block(
                        BlockType.VARIABLE,
                        currentContent,
                        {isSave: false}
                    );
                }

                /* handle other cases */
            } else {
                blocks[i] = new Block(BlockType.STATIC, currentToken);
            }

            //console.log('TYPE:', blocks[i].type, blocks[i].content);
        }
        return blocks;
    },

    /**
     * Splits the input into an array of tokens
     *
     * @param {String} input
     * @returns {String[]}
     * @private
     */
    _tokenize: function (input) {
        var inputLength = input.length,
            _BLOCK_START_CHAR = this.BLOCK_START_CHAR,
            _BLOCK_END_CHAR = this.BLOCK_END_CHAR,
            _BLOCK_DELIMITER_REPEAT_NO_SAVE = this.BLOCK_DELIMITER_REPEAT_NO_SAVE,
            _BLOCK_DELIMITER_REPEAT_SAVE = this.BLOCK_DELIMITER_REPEAT_SAVE,
            blockStartString = new Array(_BLOCK_DELIMITER_REPEAT_NO_SAVE + 1).join(_BLOCK_START_CHAR),
            blockEndString = new Array(_BLOCK_DELIMITER_REPEAT_NO_SAVE + 1).join(_BLOCK_END_CHAR),
            tokens = [],
            startCursor = 0,
            endCursor = 0,
            currentBlockIndex = 0,
            i = 0,
            nextStartCursor,
            content;

        do {
            // If the first character is a bracket look for the ending one
            if (input.charAt(startCursor) === _BLOCK_START_CHAR) {
                endCursor = input.indexOf(
                    blockEndString,
                    startCursor
                );
                endCursor += _BLOCK_DELIMITER_REPEAT_NO_SAVE - 1;

                if (input.charAt(endCursor + 1) === _BLOCK_END_CHAR) {
                    endCursor++;
                }

                nextStartCursor = endCursor + 1;
            } else { // Look for the beginning of the next block
                nextStartCursor = input.indexOf(blockStartString, startCursor + 1);
                if (nextStartCursor === -1) {
                    endCursor = inputLength;
                } else {
                    endCursor = nextStartCursor - 1;
                }
            }

            content = input.substr(startCursor, endCursor - startCursor + 1);

            tokens[currentBlockIndex++] = content;

            if (++i > 100000) {
                throw new Error('Infinite loop?');
            }
            startCursor = nextStartCursor;
        } while (startCursor !== -1);
        return tokens;
    }
});
