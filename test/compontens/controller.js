/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
var jsdom = require('mocha-jsdom');
var assert = require('chai').assert;
var IrLib = require('../../dist/irlib.js');

describe('Controller', function(){
    //jsdom({globalize: true, skipWindowCheck: true});
    jsdom('<div class="outer">\n    <div class="my-class"></div>\n    <div id="my-id"><a href="#">A link</a></div>\n</div>');

    describe('#view()', function(){
        it('view should return the initialization parameter (div)', function(){
            var view = document.createElement('div');
            var controller = new IrLib.Controller(view);
            assert.equal(controller.view, view);
        });
        it('view should return the initialization parameter (object)', function(){
            var view = {};
            var controller = new IrLib.Controller(view);
            assert.equal(controller.view, view);
        });
        it('view should return the initialization parameter (selector)', function(){
            var view = '#my-id';
            var controller = new IrLib.Controller(view);
            assert.equal(controller.view, view);
        });
    })
});