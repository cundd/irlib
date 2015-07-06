/**
 * Created by daniel on 25.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('View.Parser.Block', function () {
    describe('new', function () {
        it('should initialize with the given block type and content', function () {
            var block = new IrLib.View.Parser.Block('STA', 'the content');
            assert.strictEqual(block.type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(block.content, 'the content');
            assert.deepEqual(block.meta, {});
        });
        it('should initialize with the given block type, content and meta data', function () {
            var block = new IrLib.View.Parser.Block('STA', 'the content', {'isSave': true});
            assert.strictEqual(block.type, IrLib.View.Parser.BlockType.STATIC);
            assert.strictEqual(block.content, 'the content');
            assert.isTrue(block.meta.isSave);
        });
    });
});
