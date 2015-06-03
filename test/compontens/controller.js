/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
var jsdom = require('mocha-jsdom');
var assert = require('chai').assert;
var IrLib = require('../../dist/irlib.js');

describe('Controller', function(){
    //jsdom({globalize: true, skipWindowCheck: true});
    jsdom({
        html:'<div class="outer">\n    <div class="my-class" id="my-id"></div>\n    <div id="my-id-inner"><a href="#">A link</a></div>\n</div>'
    });

    describe('#view', function(){
        it('should return the initialization parameter (div)', function(){
            var view = document.createElement('div');
            var controller = new IrLib.Controller(view);
            assert.strictEqual(controller.view, view);
        });
        //it('should return the initialization parameter (object)', function(){
        //    var view = {};
        //    var controller = new IrLib.Controller(view);
        //    assert.strictEqual(controller.view, view);
        //});
        it('should return the initialization parameter (selector)', function(){
            var view = '#my-id';
            var controller = new IrLib.Controller(view);
            assert.strictEqual(controller.view, view);
        });
    });

    describe('#eventNames', function(){
        it('should return all keys of the controllers "events" property', function(){
            var controller = new (IrLib.Controller.extend({
                events: {
                    'click': function() {},
                    'keydown': function() {}
                }
            }));
            assert.sameMembers(controller.eventNames(), ['click', 'keydown']);
        });
    });
});