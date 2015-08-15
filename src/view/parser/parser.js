/**
 * Created by COD on 25.06.15.
 */
require('view/parser/interface');

/**
 * Template Parser implementation
 */
IrLib.View.Parser.Parser = IrLib.View.Parser.Interface.extend({
    /**
     * Start of an expression
     */
    EXPRESSION_START: '{%',

    /**
     * End of an expression
     */
    EXPRESSION_END: '%}',

    /**
     * Start character of a block
     */
    BLOCK_START_CHAR: '{',

    /**
     * End character of a block
     */
    BLOCK_END_CHAR: '}',

    /**
     * Number the block start and end characters have to occur to build an un-safe block
     */
    BLOCK_DELIMITER_REPEAT_NO_SAFE: 2,

    /**
     * Number the block start and end characters have to occur to build an safe block
     */
    BLOCK_DELIMITER_REPEAT_SAFE: 3,

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
            throw new TypeError('Expected argument "input" to be of type string, ' + (typeof input) + ' given');
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
            ExpressionType = IrLib.View.Parser.ExpressionType,
            _PATTERN_VARIABLE = this.PATTERN_VARIABLE,
            _BLOCK_START_CHAR = this.BLOCK_START_CHAR,
            _BLOCK_END_CHAR = this.BLOCK_END_CHAR,
            _BLOCK_DELIMITER_REPEAT_NO_SAFE = this.BLOCK_DELIMITER_REPEAT_NO_SAFE,
            _BLOCK_DELIMITER_REPEAT_SAFE = this.BLOCK_DELIMITER_REPEAT_SAFE,
            _EXPRESSION_START = this.EXPRESSION_START,
            _EXPRESSION_END = this.EXPRESSION_END,
            blockStartString = new Array(_BLOCK_DELIMITER_REPEAT_NO_SAFE + 1).join(_BLOCK_START_CHAR),
            expressionLength = _EXPRESSION_START.length,
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
                startsWithBlockStart = currentToken.substr(0, 1) === _BLOCK_START_CHAR;
            } else {
                startsWithBlockStart = false;
            }

            if (startsWithBlockStart && currentToken.substr(0, _BLOCK_DELIMITER_REPEAT_NO_SAFE) === blockStartString &&
                _PATTERN_VARIABLE.test(currentToken)) {
                currentContent = currentToken.substring(
                    _BLOCK_DELIMITER_REPEAT_NO_SAFE,
                    currentTokenLength - _BLOCK_DELIMITER_REPEAT_NO_SAFE
                );

                var contentFirstCharacterIsBlockStart = currentContent.charAt(0) === _BLOCK_START_CHAR;
                if (
                    contentFirstCharacterIsBlockStart &&
                    (currentContent.charAt(
                        currentTokenLength - _BLOCK_DELIMITER_REPEAT_NO_SAFE - _BLOCK_DELIMITER_REPEAT_NO_SAFE - 1
                    ) === _BLOCK_END_CHAR)
                ) { // Case 1 = safe: {{{varName}}}
                    blocks[i] = new Block(
                        BlockType.VARIABLE,
                        currentToken.substring(_BLOCK_DELIMITER_REPEAT_SAFE, currentTokenLength - _BLOCK_DELIMITER_REPEAT_SAFE),
                        {isSafe: true}
                    );
                } else if (contentFirstCharacterIsBlockStart) { // Case 2 = invalid: {{varName}
                    blocks[i] = new Block(BlockType.STATIC, currentToken);
                } else { // Case 3 = not safe: {{varName}}
                    blocks[i] = new Block(
                        BlockType.VARIABLE,
                        currentContent,
                        {isSafe: false}
                    );
                }

            } else if (startsWithBlockStart &&
                currentToken.substr(0, expressionLength) === _EXPRESSION_START &&
                currentToken.substr(currentTokenLength - expressionLength) == _EXPRESSION_END
            ) {
                var expressionType;
                currentContent = currentToken.substring(expressionLength, currentTokenLength - expressionLength);

                if (ExpressionType.isKeyword(currentContent)) {
                    expressionType = currentContent;
                } else if (ExpressionType.isKeyword(currentContent.substring(0, currentContent.indexOf(' ')))) {
                    expressionType = currentContent.substring(0, currentContent.indexOf(' '));
                } else {
                    expressionType = ExpressionType.UNKNOWN;
                }
                blocks[i] = new Block(BlockType.EXPRESSION, currentContent, {
                    expressionType: expressionType
                });


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
                    _BLOCK_END_CHAR,
                    startCursor
                );
                while (input.charAt(endCursor + 1) === _BLOCK_END_CHAR && endCursor < inputLength) {
                    endCursor++;
                }

                nextStartCursor = endCursor + 1;
            } else { // Look for the beginning of the next block
                nextStartCursor = input.indexOf(_BLOCK_START_CHAR, startCursor + 1);
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
