/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var jsdom = require('mocha-jsdom');
var assert = require('chai').assert;
var IrLib = require('../../dist/irlib.js');

describe('Utility', function () {
    describe('GeneralUtility', function () {
        //jsdom({globalize: true, skipWindowCheck: true});
        jsdom({
            html:'<div class="outer">\n    <div class="my-class" id="my-id"></div>\n    <div id="my-id-inner"><a href="#">A link</a></div>\n</div>'
        });

        describe('#domNode()', function () {
            it('should return the dom node when passing a dom node', function () {
                var view = document.createElement('div');
                assert.strictEqual(IrLib.Utility.GeneralUtility.domNode(view), view);
            });
            it('should return a matching dom node when passing an ID string', function () {
                var node = IrLib.Utility.GeneralUtility.domNode('#my-id');
                assert.notEqual(node, null);
                assert.strictEqual(node.id, 'my-id')
            });
            it('should return a matching dom node when passing a class string', function () {
                var node = IrLib.Utility.GeneralUtility.domNode('.my-class');
                assert.notEqual(node, null);
                assert.strictEqual(node.id, 'my-id')
            });
        });

        describe('#isDomNode()', function () {
            it('should return true if a dom node is given', function () {
                assert.isTrue(IrLib.Utility.GeneralUtility.isDomNode(document));
                assert.isTrue(IrLib.Utility.GeneralUtility.isDomNode(document.getElementById('my-id')));
            });
            it('should return false if no dom node is given', function () {
                assert.isFalse(IrLib.Utility.GeneralUtility.isDomNode());
                assert.isFalse(IrLib.Utility.GeneralUtility.isDomNode(""));
                assert.isFalse(IrLib.Utility.GeneralUtility.isDomNode('.my-class'));
                assert.isFalse(IrLib.Utility.GeneralUtility.isDomNode(document.getElementById('my-not-existing-id')));
            });
        });
    })
});