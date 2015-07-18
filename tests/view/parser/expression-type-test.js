/**
 * Created by daniel on 25.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('View.Parser.ExpressionType', function () {
    describe('getTypeForKeyword', function () {
        it('should return CONDITIONAL_START for keyword if', function () {
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('if'), IrLib.View.Parser.ExpressionType.CONDITIONAL_START);
        });
        it('should return CONDITIONAL_END for keyword endif', function () {
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('endif'), IrLib.View.Parser.ExpressionType.CONDITIONAL_END);
        });
        it('should return REPEATING_START for keyword for', function () {
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('for'), IrLib.View.Parser.ExpressionType.REPEATING_START);
        });
        it('should return REPEATING_END for keyword endfor', function () {
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('endfor'), IrLib.View.Parser.ExpressionType.REPEATING_END);
        });
        it('should return VIEW for keyword view', function () {
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('view'), IrLib.View.Parser.ExpressionType.VIEW);
        });
        it('should return ELSE for keyword else', function () {
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('else'), IrLib.View.Parser.ExpressionType.ELSE);
        });
        it('should return UNKNOWN for undefined keyword', function () {
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('unknownKeyword'), IrLib.View.Parser.ExpressionType.UNKNOWN);
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('aView'), IrLib.View.Parser.ExpressionType.UNKNOWN);
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('endView'), IrLib.View.Parser.ExpressionType.UNKNOWN);
            assert.strictEqual(IrLib.View.Parser.ExpressionType.getTypeForKeyword('endElse'), IrLib.View.Parser.ExpressionType.UNKNOWN);
        });
    });
    describe('isKeyword', function () {
        it('should return true for keyword if', function () {
            assert.isTrue(IrLib.View.Parser.ExpressionType.isKeyword('if'));
        });
        it('should return true for keyword endif', function () {
            assert.isTrue(IrLib.View.Parser.ExpressionType.isKeyword('endif'));
        });
        it('should return true for keyword for', function () {
            assert.isTrue(IrLib.View.Parser.ExpressionType.isKeyword('for'));
        });
        it('should return true for keyword endfor', function () {
            assert.isTrue(IrLib.View.Parser.ExpressionType.isKeyword('endfor'));
        });
        it('should return true for keyword view', function () {
            assert.isTrue(IrLib.View.Parser.ExpressionType.isKeyword('view'));
        });
        it('should return true for keyword else', function () {
            assert.isTrue(IrLib.View.Parser.ExpressionType.isKeyword('else'));
        });
        it('should return false for undefined keyword', function () {
            assert.isFalse(IrLib.View.Parser.ExpressionType.isKeyword('unknownKeyword'));
            assert.isFalse(IrLib.View.Parser.ExpressionType.isKeyword('aView'));
            assert.isFalse(IrLib.View.Parser.ExpressionType.isKeyword('endView'));
            assert.isFalse(IrLib.View.Parser.ExpressionType.isKeyword('endElse'));
        });
    });
});
