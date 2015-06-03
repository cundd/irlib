/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
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
            it('passing a dom node should return the dom node', function () {
                var view = document.createElement('div');
                assert.equal(IrLib.Utility.GeneralUtility.domNode(view), view);
            });
            it('passing a string should return a matching dom node (ID)', function () {
                var node = IrLib.Utility.GeneralUtility.domNode('#my-id');
                assert.notEqual(node, null);
                assert.equal(node.id, 'my-id')
            });
            it('passing a string should return a matching dom node (class)', function () {
                var node = IrLib.Utility.GeneralUtility.domNode('.my-class');
                assert.notEqual(node, null);
                assert.equal(node.id, 'my-id')
            });
        })
    })
});