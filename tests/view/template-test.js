/**
 * Created by daniel on 25.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('View.Template', function () {
    bootstrapDocument();

    var buildEvent = function (eventName) {
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
            return event;
        },
        getFixturesDivToEnableBubbling = function () {
            return document.getElementById('mocha-fixtures');
        },
        getTemplateDomString = function() {
            return '<div class="some-element"><header>{{headline}}</header><section>My content</section></div>';
        },
        createTemplateDom = function (id) {
            var element = document.createElement('div');

            element.type = 'text/irlib-template';
            element.innerHTML = getTemplateDomString();
            element.id = id.charAt(0) === '#' ? id.substr(1) : id;

            getFixturesDivToEnableBubbling().appendChild(element);
            return element;
        };

    describe('new', function () {
        it('should take the first element as template (string)', function () {
            var template = '<div><h1>Heading</h1></div>',
                view = new IrLib.View.Template(template);
            assert.strictEqual(view._template, template);
        });
        it('should take the first element as template (selector)', function () {
            var template = '#my-template',
                view;
            createTemplateDom(template);
            view = new IrLib.View.Template(template);
            assert.strictEqual(view._template, getTemplateDomString());
        });
        it('should take the second element as variables', function () {
            var view = new IrLib.View.Template('', {
                'aKey': 'aValue'
            });
            assert.strictEqual(view._variables['aKey'], 'aValue');
        });
        it('should inherit the template (string)', function () {
            var template = '<div><h1>Heading</h1></div>',
                view = new (IrLib.View.Template.extend({
                    template: template
                }));
            assert.strictEqual(view._template, template);
        });
        it('should inherit the template (selector)', function () {
            var template = '#my-template',
                view;
            createTemplateDom(template);
            view = new (IrLib.View.Template.extend({
                template: template
            }));
            assert.strictEqual(view._template, getTemplateDomString());
        });
        it('should throw exception if the argument is not of type string', function () {
            assert.throws(function () {
                new IrLib.View.Template({});
            });
        });
    });
    describe('setTemplate()', function () {
        it('should overwrite the template and set needsRedraw (string)', function () {
            var view = new IrLib.View.Template(),
                template = '<div><h1>Heading</h1></div>';

            view.setTemplate(template);
            assert.strictEqual(view.template, template);
            assert.strictEqual(view.needsRedraw, true);
        });
        it('should overwrite the template and set needsRedraw (selector)', function () {
            var template = '#my-template',
                view = new IrLib.View.Template();
            createTemplateDom(template);
            view.setTemplate(template);
            assert.strictEqual(view.template, getTemplateDomString());
            assert.strictEqual(view.needsRedraw, true);
        });
        it.skip('should load templates lazy', function () {
            var template = '#my-template-lazy-loaded',
                view = new IrLib.View.Template();

            view.setTemplate(template);

            assert.strictEqual(view._template, template);
            assert.strictEqual(view.needsRedraw, true);

            createTemplateDom(template);

            assert.strictEqual(view.template, getTemplateDomString());
            assert.strictEqual(view.needsRedraw, true);
        });
    });
    describe('template=', function () {
        it('should overwrite the template and set needsRedraw', function () {
            var view = new IrLib.View.Template(),
                template = '<div><h1>Heading</h1></div>';

            view.template = template;
            assert.strictEqual(view.template, template);
            assert.strictEqual(view.needsRedraw, true);
        });
        it('should overwrite the template and set needsRedraw (selector)', function () {
            var template = '#my-template',
                view = new IrLib.View.Template();
            createTemplateDom(template);

            view.template = template;
            assert.strictEqual(view._template, getTemplateDomString());
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
    describe('variables=', function () {
        it('should overwrite previous variables', function () {
            var view = new IrLib.View.Template(),
                variables = {'newKey': 'newValue'};
            view.assignVariable('key1', 'aValue');
            view.assignVariable('key2', variables);

            view.variables = variables;

            assert.typeOf(view._variables['newKey'], 'string');
            assert.strictEqual(view._variables['newKey'], 'newValue');
            assert.isUndefined(view._variables['key1']);
            assert.isUndefined(view._variables['key2']);
        });
        it('should convert object to Dictionary', function () {
            var view = new IrLib.View.Template();
            view.variables = {'newKey': 'newValue'};
            assert.instanceOf(view._variables, IrLib.Dictionary);
        });
    });
    describe('getVariables()', function () {
        it('should return variables', function () {
            var view = new IrLib.View.Template(),
                variables = {'newKey': 'newValue'};
            view.assignVariable('key1', 'aValue');
            view.assignVariable('key2', variables);

            var retrievedVariables = view.getVariables();
            assert.instanceOf(retrievedVariables, IrLib.Dictionary);
            assert.typeOf(retrievedVariables['key1'], 'string');
            assert.strictEqual(retrievedVariables['key1'], 'aValue');
            assert.typeOf(retrievedVariables['key2'], 'object');
            assert.strictEqual(retrievedVariables['key2'], variables);
        });
        it('should convert object to Dictionary', function () {
            var view = new IrLib.View.Template();
            view.variables = {'newKey': 'newValue'};
            assert.instanceOf(view.getVariables(), IrLib.Dictionary);
        });
    });
    describe('=variables', function () {
        it('should return variables', function () {
            var view = new IrLib.View.Template(),
                variables = {'newKey': 'newValue'};
            view.assignVariable('key1', 'aValue');
            view.assignVariable('key2', variables);

            assert.instanceOf(view.variables, IrLib.Dictionary);
            assert.typeOf(view.variables['key1'], 'string');
            assert.strictEqual(view.variables['key1'], 'aValue');
            assert.typeOf(view.variables['key2'], 'object');
            assert.strictEqual(view.variables['key2'], variables);
        });
        it('should convert object to Dictionary', function () {
            var view = new IrLib.View.Template();
            view.variables = {'newKey': 'newValue'};
            assert.instanceOf(view.variables, IrLib.Dictionary);
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
        it('should trim whitespaces', function () {
            var view = new IrLib.View.Template("    \t\n<div><h1>Headline</h1></div> "),
                ELEMENT_NODE = 1;

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<h1>Headline</h1>')

        });
        it('should inherit the template (string)', function () {
            var template = '<div><h1>{{headline}}</h1></div>',
                view = new (IrLib.View.Template.extend({
                    template: template
                })),
                variables = {'headline': 'This worked'},
                ELEMENT_NODE = 1;

            view.setVariables(variables);
            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
        });
        it('should inherit the template (selector)', function () {
            var template = '#my-template',
                variables = {'headline': 'This worked'},
                ELEMENT_NODE = 1,
                view;

            createTemplateDom(template);
            view = new (IrLib.View.Template.extend({
                template: template
            }));

            view.setVariables(variables);
            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<header>This worked</header><section>My content</section>');
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
        it('should throw an exception if the element is not defined', function () {
            var view = new IrLib.View.Template('<div><h1>{{headline}}</h1></div>');
            assert.throws(function () {
                view.appendTo();
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
        it('should remove the View from DOM and allow to append it afterwards', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                element = document.createElement('div');

            view.appendTo(element);
            assert.isDefined(element.firstChild);
            assert.strictEqual(element.firstChild.innerHTML, '<h1>Headline</h1>');

            view.remove();

            assert.isNull(element.firstChild);

            view.appendTo(element);
            assert.isNotNull(element.firstChild);
            assert.strictEqual(element.firstChild.innerHTML, '<h1>Headline</h1>');
        });
        it('should do nothing if not inserted', function () {
            (new IrLib.View.Template()).remove();
        });
    });
    describe('isVisible()', function () {
        it('should return false at initialization', function () {
            assert.isFalse((new IrLib.View.Template('<div><h1>Headline</h1></div>')).isVisible());
        });
        it('should return false if not added to the document', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                element = document.createElement('div');

            view.appendTo(element);
            assert.isFalse(view.isVisible());
        });
        it('should return true if added to the visible DOM', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                element = document.createElement('div');

            view.appendTo(element);
            getFixturesDivToEnableBubbling().appendChild(element);
            assert.isTrue(view.isVisible());
        });
    });
    describe('reload()', function () {
        it('should update the DOM element', function () {
            var view = new IrLib.View.Template('<div><h1>{{headline}}</h1></div>'),
                element = document.createElement('div'),
                result;

            view.variables = {'headline': 'This worked'};
            view.appendTo(element);
            result = element.firstChild;
            assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');

            view.variables = {'headline': 'Refreshed'};
            view.reload();

            result = element.firstChild;
            assert.isDefined(result);
            assert.strictEqual(result.innerHTML, '<h1>Refreshed</h1>');
        });
        it('should throw exception if not added to the DOM', function () {
            assert.throw(function() {
                var view = new (IrLib.View.Template.extend({
                        template: '<div><h1>{{headline}}</h1></div>'
                    })),
                    result;

                view.variables = {'headline': 'This worked'};
                result = view.render();
                assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');

                view.variables = {'headline': 'Refreshed'};
                result = view.render();
                assert.strictEqual(result.innerHTML, '<h1>Refreshed</h1>');
                result = view.reload();
                assert.strictEqual(result.innerHTML, '<h1>Refreshed</h1>');
            });
        });
    });

    if (TestRunner.name !== 'mocha-cli') {
        describe('addEventListener()', function () {
            it('should bind event listeners', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null;

                view.addEventListener('click', function (event) {
                    target = event.irTarget;
                    handler = this;
                    clicked = true;
                });

                view.dispatchEvent(buildEvent('click'));
                assert.isTrue(clicked, 'Child element was not clicked');
                assert.isFalse(keyPressed);
                assert.equal(target, view);
            });
            it('should handle bubbled events', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    childNode = document.createElement('span'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    irTarget = null,
                    viewDom;

                viewDom = view.render();
                viewDom.appendChild(childNode);
                getFixturesDivToEnableBubbling().appendChild(viewDom);

                view.addEventListener('click', function (event) {
                    target = event.target;
                    irTarget = event.irTarget;
                    handler = this;
                    clicked = true;
                });

                childNode.dispatchEvent(buildEvent('click'));

                assert.strictEqual(view.render().firstChild, childNode);
                assert.isTrue(clicked, 'Child element was not clicked');
                assert.isFalse(keyPressed, 'A key has been pressed');
                assert.equal(target, childNode);
                assert.equal(irTarget, view);
            });
            it('should invoke event methods only once', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    clicked = 0,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    callback;

                callback = function (event) {
                    target = event.irTarget;
                    handler = this;
                    clicked = true;
                };
                view.addEventListener('click', callback);
                view.addEventListener('click', callback);
                view.addEventListener('click', callback);
                view.addEventListener('click', callback);

                view.dispatchEvent(buildEvent('click'));
                assert.equal(clicked, 1);
                assert.isFalse(keyPressed);
                assert.equal(target, view);
            });
            it('should invoke event methods after reload', function () {
                var view = new IrLib.View.Template('<div>{{content}}</div>', {content: 'hello'}),
                    clicked = 0,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    callback;

                callback = function (event) {
                    target = event.irTarget;
                    handler = this;
                    clicked = true;
                };

                //view.appendTo(getFixturesDivToEnableBubbling());
                getFixturesDivToEnableBubbling().appendChild(view.render());

                view.addEventListener('click', callback);

                view.variables = {content: 'new content'};
                view.reload();

                view._dom.dispatchEvent(buildEvent('click'));
                assert.equal(clicked, 1);
                assert.isFalse(keyPressed);
                assert.equal(target, view);
            });
        });
    }
});
