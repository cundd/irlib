/**
 * Created by daniel on 25.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('View.Template', function () {

    bootstrapDocument();
    //
    //var buildEvent = function (eventName) {
    //        var event = document.createEvent('Event');
    //        event.initEvent(eventName, true, true);
    //        return event;
    //    },
    //    getFixturesDiv = function () {
    //        return document.getElementById('mocha-fixtures');
    //    };

    describe('new', function () {
        it('should take the first element as template', function () {
            var template = '<div><h1>Heading</h1></div>',
                view = new IrLib.View.Template(template);
            assert.strictEqual(view._template, template);
        });
        it('should throw exception if the argument is not of type string', function () {
            assert.throws(function () {
                new IrLib.View.Template({});
            });
        });
    });
    describe('setTemplate()', function () {
        it('should overwrite the template and set needsRedraw', function () {
            var view = new IrLib.View.Template(),
                template = '<div><h1>Heading</h1></div>';

            view.setTemplate(template);
            assert.strictEqual(view._template, template);
            assert.strictEqual(view.needsRedraw, true);
        });
    });
    describe('assignVariable()', function () {
        it('should add new variable', function () {
            var view = new IrLib.View.Template(),
                value = {'name': 'A test object'};
            view.assignVariable('key1', 'aValue');
            view.assignVariable('key2', value);
            assert.strictEqual(view._variables['key1'], 'aValue');
            assert.strictEqual(view._variables['key2'], value);
        });
    });
    describe('setVariables()', function () {
        it('should overwrite previous variables', function () {
            var view = new IrLib.View.Template(),
                variables = {'newKey': 'newValue'};
            view.assignVariable('key1', 'aValue');
            view.assignVariable('key2', variables);

            view.setVariables(variables);

            assert.typeOf(view._variables['newKey'], 'string');
            assert.strictEqual(view._variables['newKey'], 'newValue');
            assert.isUndefined(view._variables['key1']);
            assert.isUndefined(view._variables['key2']);
        });
        it('should convert object to Dictionary', function () {
            var view = new IrLib.View.Template();
            view.setVariables({'newKey': 'newValue'});
            assert.instanceOf(view._variables, IrLib.Dictionary);
        });
    });
    describe('render()', function () {
        it('should build a DOM element', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                ELEMENT_NODE = 1;

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<h1>Headline</h1>')

        });
        it('should build a DOM element and replace variables', function () {
            var view = new IrLib.View.Template('<div><h1>{{headline}}</h1></div>'),
                variables = {'headline': 'This worked'},
                ELEMENT_NODE = 1;

            view.setVariables(variables);

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
        });
        it('should throw an exception if the template is not set', function () {
            var view = new IrLib.View.Template();
            assert.throws(function () {
                view.render();
            });
        });
    });
    describe('appendTo()', function () {
        it('should build a DOM element and insert it to the parent', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                element = document.createElement('div'),
                ELEMENT_NODE = 1;

            view.appendTo(element);

            var result = element.firstChild;
            assert.isDefined(result);
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<h1>Headline</h1>');
        });
        it('should build a DOM element and replace variables', function () {
            var view = new IrLib.View.Template('<div><h1>{{headline}}</h1></div>'),
                variables = {'headline': 'This worked'},
                element = document.createElement('div'),
                ELEMENT_NODE = 1;

            view.setVariables(variables);

            view.appendTo(element);

            var result = element.firstChild;
            assert.isDefined(result);
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
        });
        it('should use the result from render()', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                element = document.createElement('div');

            view.appendTo(element);

            var result = element.firstChild;
            assert.strictEqual(result, view.render());
            assert.strictEqual(result, view._dom);
            assert.strictEqual(result, view._lastInsertedNode);
        });
        it('should throw an exception if the element is not a valid node', function () {
            var view = new IrLib.View.Template('<div><h1>{{headline}}</h1></div>');
            assert.throws(function () {
                view.appendTo({});
            });
        });
        it('should throw an exception if the template is not set', function () {
            var view = new IrLib.View.Template();
            assert.throws(function () {
                view.appendTo(document.createElement('div'));
            });
        });
    });
    describe('remove()', function () {
        it('should remove the View from DOM', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                element = document.createElement('div');

            view.appendTo(element);
            assert.isDefined(element.firstChild);
            assert.strictEqual(element.firstChild.innerHTML, '<h1>Headline</h1>');


            view.remove();

            assert.isNull(element.firstChild);
        });
        it('should do nothing if not inserted', function () {
            (new IrLib.View.Template()).remove();
        });
    });
});