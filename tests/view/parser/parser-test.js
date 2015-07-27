/**
 * Created by daniel on 25.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('View.Parser.Parser', function () {
    describe('parse', function () {
        it('should return single block for static template', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('my template');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(blocks[0].content, 'my template');
        });
        it('should return single block for unsafe variable in template', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{{myVariable}}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[0].content, 'myVariable');
            assert.strictEqual(blocks[0].meta.isSafe, false);
        });
        it('should return single block for safe variable template', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{{{myVariable}}}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[0].content, 'myVariable');
            assert.strictEqual(blocks[0].meta.isSafe, true);
        });
        it('should return single block for nested variable template', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{{parent.child}}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[0].content, 'parent.child');
            assert.strictEqual(blocks[0].meta.isSafe, false);
        });
        it('should return single block for complex variable template', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{{my-parent.child_variable.lastElement}}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[0].content, 'my-parent.child_variable.lastElement');
            assert.strictEqual(blocks[0].meta.isSafe, false);
        });
        it('should return single block for invalid variable template', function () {
            var parser = new IrLib.View.Parser.Parser(),
                blocks;

            blocks = parser.parse('{{pa%rent.child}}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(blocks[0].content, '{{pa%rent.child}}');

            blocks = parser.parse('{{no whitespaces allowed}}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(blocks[0].content, '{{no whitespaces allowed}}');

            blocks = parser.parse('{{no-{-in-variable}}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(blocks[0].content, '{{no-{-in-variable}}');

            blocks = parser.parse('{{{authorName}}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(blocks[0].content, '{{{authorName}}');
        });
        it('should return single block for expression template', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{%an expression%}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.EXPRESSION);
            assert.strictEqual(blocks[0].content, 'an expression');
            assert.strictEqual(blocks[0].meta.expressionType, IrLib.View.Parser.ExpressionType.UNKNOWN);
        });
        it('should return single block for expression template (if)', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{%if condition%}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.EXPRESSION);
            assert.strictEqual(blocks[0].content, 'if condition');
            assert.strictEqual(blocks[0].meta.expressionType, IrLib.View.Parser.ExpressionType.CONDITIONAL_START);
        });
        it('should return single block if expression template (endif)', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{%endif%}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.EXPRESSION);
            assert.strictEqual(blocks[0].content, 'endif');
            assert.strictEqual(blocks[0].meta.expressionType, IrLib.View.Parser.ExpressionType.CONDITIONAL_END);
        });
        it('should return single block if expression template (endif)', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{%else%}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.EXPRESSION);
            assert.strictEqual(blocks[0].content, 'else');
            assert.strictEqual(blocks[0].meta.expressionType, IrLib.View.Parser.ExpressionType.ELSE);
        });
        it('should return single block for expression template (for)', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{%for var in container%}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.EXPRESSION);
            assert.strictEqual(blocks[0].content, 'for var in container');
            assert.strictEqual(blocks[0].meta.expressionType, IrLib.View.Parser.ExpressionType.REPEATING_START);
        });
        it('should return single block for expression template (endfor)', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{%endfor%}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.EXPRESSION);
            assert.strictEqual(blocks[0].content, 'endfor');
            assert.strictEqual(blocks[0].meta.expressionType, IrLib.View.Parser.ExpressionType.REPEATING_END);
        });
        it('should return single block for expression template (view)', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('{%view viewName%}');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.EXPRESSION);
            assert.strictEqual(blocks[0].content, 'view viewName');
            assert.strictEqual(blocks[0].meta.expressionType, IrLib.View.Parser.ExpressionType.VIEW);
        });

        it('should return multiple blocks for complex variable template', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('<div><h1>This article is about {{article.topic}}</h1><span>Written by {{{authorName}}}</span></div>');
            assert.instanceOf(blocks[0], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[0].type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(blocks[0].content, '<div><h1>This article is about ');

            assert.instanceOf(blocks[1], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[1].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[1].content, 'article.topic');
            assert.strictEqual(blocks[1].meta.isSafe, false);

            assert.instanceOf(blocks[2], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[2].type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(blocks[2].content, '</h1><span>Written by ');

            assert.instanceOf(blocks[3], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[3].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[3].content, 'authorName');
            assert.strictEqual(blocks[3].meta.isSafe, true);

            assert.instanceOf(blocks[4], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[4].type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(blocks[4].content, '</span></div>');
        });

        it('should return multiple blocks for complex variable template with edge cases', function () {
            var parser = new IrLib.View.Parser.Parser();
            var blocks = parser.parse('<div><h1>This article is about {{article.topic}} {{article.readCount}}</h1><span>Written by {{{author.firstName}}} {{}} {{author.lastName}}</span></div>');
            var blockIndex = 0;
            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, '<div><h1>This article is about ');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.STATIC);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, 'article.topic');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[blockIndex].meta.isSafe, false);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, ' ');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.STATIC);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, 'article.readCount');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[blockIndex].meta.isSafe, false);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, '</h1><span>Written by ');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.STATIC);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, 'author.firstName');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[blockIndex].meta.isSafe, true);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, ' ');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.STATIC);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, '{{}}');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.STATIC);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, ' ');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.STATIC);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, 'author.lastName');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.VARIABLE);
            assert.strictEqual(blocks[blockIndex].meta.isSafe, false);
            blockIndex++;

            assert.instanceOf(blocks[blockIndex], IrLib.View.Parser.Block);
            assert.strictEqual(blocks[blockIndex].content, '</span></div>');
            assert.strictEqual(blocks[blockIndex].type, IrLib.View.Parser.BlockType.STATIC);
        });

        it('should throw for invalid input', function () {
            var parser = new IrLib.View.Parser.Parser();
            assert.throws(function () {
                parser.parse();
            }, TypeError);
            assert.throws(function () {
                parser.parse(1);
            }, TypeError);
            assert.throws(function () {
                parser.parse({});
            }, TypeError);
            assert.throws(function () {
                parser.parse(null);
            }, TypeError);
        });
    });
});
