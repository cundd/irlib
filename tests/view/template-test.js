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
        getTemplateDomString = function () {
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
        it('should inherit the variables', function () {
            var view = new (IrLib.View.Template.extend({
                variables: {
                    'aKey': 'aValue'
                }
            }));
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
        it('should throw for invalid input', function () {
            assert.throws(function () {
                (new IrLib.View.Template()).setVariables(false);
            });
            assert.throws(function () {
                (new IrLib.View.Template()).setVariables(undefined);
            });
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
    describe('setContext()', function () {
        it('should overwrite previous context', function () {
            var context = new IrLib.View.Template(),
                initialContext = new IrLib.View.Template(),
                view = new (IrLib.View.Template.extend({
                    context: initialContext
                }));

            assert.strictEqual(view._context, initialContext);
            view.setContext(context);
            assert.strictEqual(view._context, context);
        });
    });
    describe('context=', function () {
        it('should overwrite previous context', function () {
            var context = new IrLib.View.Template(),
                initialContext = new IrLib.View.Template(),
                view = new (IrLib.View.Template.extend({
                    context: initialContext
                }));

            assert.strictEqual(view._context, initialContext);
            view.context = context;
            assert.strictEqual(view._context, context);
        });
    });
    describe('getContext()', function () {
        it('should return initial context', function () {
            var initialContext = new IrLib.View.Template(),
                view = new (IrLib.View.Template.extend({
                    context: initialContext
                }));

            assert.strictEqual(view.getContext(), initialContext);
        });
    });
    describe('=context', function () {
        it('should return initial context', function () {
            var initialContext = new IrLib.View.Template(),
                view = new (IrLib.View.Template.extend({
                    context: initialContext
                }));

            assert.strictEqual(view.context, initialContext);
        });
    });
    describe('render()', function () {
        it('should build a DOM element', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                ELEMENT_NODE = 1;

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>Headline</h1></div>')
        });
        it('should build a DOM element and replace variables', function () {
            var view = new IrLib.View.Template('<div><h1>{{headline}}</h1></div>'),
                variables = {'headline': 'This worked'},
                ELEMENT_NODE = 1;

            view.setVariables(variables);

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
        });
        it('should build a DOM element and replace nested variables', function () {
            var view = new IrLib.View.Template('<div><h1>{{meta.headline}}</h1></div>'),
                variables = {'meta': {'headline': 'This worked'}},
                ELEMENT_NODE = 1;

            view.setVariables(variables);

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
        });
        it('should build a DOM element with changed tag name', function () {
            var view = new (IrLib.View.Template.extend({
                    tagName: 'section',
                    template: '&nbsp;'
                })),
                ELEMENT_NODE = 1;

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.outerHTML, '<section>&nbsp;</section>')
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
            assert.strictEqual(result.innerHTML, '<div><h1>Headline</h1></div>')

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
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
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
            assert.strictEqual(result.innerHTML, '<div class="some-element"><header>This worked</header><section>My content</section></div>');
        });
        it('should escape variable content', function () {
            var view = new IrLib.View.Template('<div><h1>{{headline}}</h1></div>'),
                variables = {'headline': 'This <strong>worked</strong>'},
                ELEMENT_NODE = 1;

            view.setVariables(variables);

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This &lt;strong&gt;worked&lt;/strong&gt;</h1></div>');
        });
        it('should not escape variable content', function () {
            var view = new IrLib.View.Template('<div><h1>{{{headline}}}</h1></div>'),
                variables = {'headline': 'This <strong>worked</strong>'},
                ELEMENT_NODE = 1;

            view.setVariables(variables);

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This <strong>worked</strong></h1></div>');
        });
        it('should not render empty for undefined variables', function () {
            var view = new IrLib.View.Template('<div><h1>{{{headline}}}</h1></div>');
            var result = view.render();
            assert.strictEqual(result.innerHTML, '<div><h1></h1></div>');
        });
        it('should not throw for undefined variables', function () {
            var view = new IrLib.View.Template('<div><h1>{{{meta.headline}}}</h1></div>');
            var result = view.render();
            assert.strictEqual(result.innerHTML, '<div><h1></h1></div>');
        });
        it('should render View in template', function () {
            var sl = new IrLib.ServiceLocator(),
                ELEMENT_NODE = 1,
                view;

            sl.registerMultiple({
                mainView: (IrLib.View.Template.extend({
                    template: '<section><div>{%view header%}</div></section>'
                })),
                header: (IrLib.View.Template.extend({
                    template: '<h1>{{{headline}}}</h1>'
                }))
            });

            view = sl.get('mainView');
            view.setVariables({'headline': 'This <strong>worked</strong>'});

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.match(result.innerHTML, new RegExp('<div><script id="irLibView-irLib-\\d+" type="text/x-placeholder"></script></div>'));
            //assert.strictEqual(result.innerHTML, '<div><h1>This <strong>worked</strong></h1></div>');
        });
        it('should render conditional in template', function () {
            var view = new IrLib.View.Template('<section>{%if condition%}Condition fulfilled{%endif%}</section>');
            view.setVariables({condition: true});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Condition fulfilled</section>');
        });
        it('should render conditional empty in template', function () {
            var view = new IrLib.View.Template('<section>{%if condition%}Condition fulfilled{%endif%}</section>');
            view.setVariables({condition: false});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section></section>');
        });
        it('should render nested conditional in template', function () {
            var view = new IrLib.View.Template('<section><div>{%if article.isImportant%}Fulfilled{%endif%}</div></section>');
            view.setVariables({article: {isImportant: true}, meta: {name: 'My condition'}});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section><div>Fulfilled</div></section>');
        });
        it('should render conditional in template with variable content', function () {
            var view = new IrLib.View.Template('<section>{%if condition%}Condition "{{name}}" fulfilled{%endif%}</section>');
            view.setVariables({condition: true, name: 'My condition'});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Condition "My condition" fulfilled</section>');
        });
        it('should render conditional in template with nested variable content', function () {
            var view = new IrLib.View.Template('<section><div>{%if condition%}Condition "{{meta.name}}" fulfilled{%endif%}</div></section>');
            view.setVariables({condition: true, meta: {name: 'My condition'}});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section><div>Condition "My condition" fulfilled</div></section>');
        });
        it('should render conditional empty in template with variable content', function () {
            var view = new IrLib.View.Template(
                '<span>{%if condition%}Condition "{{meta.name}}" fulfilled{%endif%}</span>'
            );
            view.setVariables({condition: false, name: 'My condition'});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<span></span>');
        });
        it('should render conditional empty in template with nested variable content', function () {
            var view = new IrLib.View.Template(
                '<span>{%if condition%}Condition "{{meta.name}}" fulfilled{%endif%}</span>'
            );
            view.setVariables({condition: false, meta: {name: 'My condition'}});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<span></span>');
        });

        it('should render nested conditional in template with variable content', function () {
            var view = new IrLib.View.Template('<section>{%if condition.value%}Condition "{{name}}" fulfilled{%endif%}</section>');
            view.setVariables({condition: {value: true}, name: 'My condition'});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Condition "My condition" fulfilled</section>');
        });
        it('should render nested conditional in template with nested variable content', function () {
            var view = new IrLib.View.Template('<section>{%if condition.value%}Condition "{{meta.name}}" fulfilled{%endif%}</section>');
            view.setVariables({condition: {value: true}, meta: {name: 'My condition'}});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Condition "My condition" fulfilled</section>');
        });
        it('should render nested conditional empty in template with variable content', function () {
            var view = new IrLib.View.Template(
                '<span>{%if condition.value%}Condition "{{meta.name}}" fulfilled{%endif%}</span>'
            );
            view.setVariables({condition: {value: false}, name: 'My condition'});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<span></span>');
        });
        it('should render nested conditional empty in template with nested variable content', function () {
            var view = new IrLib.View.Template(
                '<span>{%if condition.value%}Condition "{{meta.name}}" fulfilled{%endif%}</span>'
            );
            view.setVariables({condition: {value: false}, meta: {name: 'My condition'}});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<span></span>');
        });

        it('should throw for missing condition', function () {
            var view = new IrLib.View.Template('<section>{%if%}Condition fulfilled{%endif%}</section>');
            view.setVariables({condition: true});

            assert.throws(function () {
                view.render();
            });
        });
        it('should render else in template', function () {
            var view = new IrLib.View.Template('<section>{%if condition%}Condition fulfilled{%else%}else statement{%endif%}</section>');
            view.setVariables({condition: false});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>else statement</section>');
        });
        it('should render else in template without tag', function () {
            var view = new IrLib.View.Template('{%if condition%}Condition fulfilled{%else%}else statement{%endif%}');
            view.setVariables({condition: false});

            var result = view.render();
            assert.strictEqual(result.innerHTML, 'else statement');
        });
        it('should not render else in template', function () {
            var view = new IrLib.View.Template('<section>{%if condition%}Condition fulfilled{%else%}not fulfilled{%endif%}</section>');
            view.setVariables({condition: true});

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Condition fulfilled</section>');
        });
        it('should handle nested if-else in template', function () {
            var view = new IrLib.View.Template('<section>{%if condition%}Outer condition fulfilled{%else%}Outer not fulfilled{%if inner.condition%} inner condition fulfilled{%else%} inner else{%endif%}{%endif%}</section>');
            view.setVariables({
                condition: false,
                inner: {
                    condition: true
                }
            });

            var result = view.render();
            assert.strictEqual(result.outerHTML, '<div><section>Outer not fulfilled inner condition fulfilled</section></div>');
        });
        it('should render nested conditional in template (true / true)', function () {
            var view = new IrLib.View.Template(
                '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                condition: true,
                innerCondition: true
            });

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Outer condition fulfilled inner Condition fulfilled</section>');
        });
        it('should render nested conditional in template (true / false)', function () {
            var view = new IrLib.View.Template(
                '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                condition: true,
                innerCondition: false
            });

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Outer condition fulfilled</section>');
        });
        it('should render nested conditional empty in template (false / false)', function () {
            var view = new IrLib.View.Template(
                '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                condition: false,
                innerCondition: false
            });

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section></section>');
        });
        it('should render nested conditional empty in template (false/ true)', function () {
            var view = new IrLib.View.Template(
                '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                condition: false,
                innerCondition: true
            });

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section></section>');
        });
        it('should render nested conditional with key path in template (true / true)', function () {
            var view = new IrLib.View.Template(
                '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                parameters: {
                    condition: true,
                    innerCondition: true
                }
            });

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Outer condition fulfilled inner Condition fulfilled</section>');
        });
        it('should render nested conditional with key path in template (true / false)', function () {
            var view = new IrLib.View.Template(
                '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                parameters: {
                    condition: true,
                    innerCondition: false
                }
            });

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section>Outer condition fulfilled</section>');
        });
        it('should render nested conditional with key path empty in template (false / false)', function () {
            var view = new IrLib.View.Template(
                '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                parameters: {
                    condition: false,
                    innerCondition: false
                }
            });

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section></section>');
        });
        it('should render nested conditional with key path empty in template (false/ true)', function () {
            var view = new IrLib.View.Template(
                '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                parameters: {
                    condition: false,
                    innerCondition: true
                }
            });

            var result = view.render();
            assert.strictEqual(result.innerHTML, '<section></section>');
        });
    });
    describe('render() with computed variables', function () {
        it('should build a DOM element and replace computed variables', function () {
            var view = new IrLib.View.Template('<div><h1>{{headline}}</h1></div>'),
                computed = {
                    headline: function () {
                        return 'This worked'
                    }
                },
                ELEMENT_NODE = 1;

            view.setComputed(computed);

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
        });
        it('should inherit the computed variables', function () {
            var template = '<div><h1>{{headline}}</h1></div>',
                view = new (IrLib.View.Template.extend({
                    template: template,
                    computed: {
                        headline: function () {
                            return 'This worked'
                        }
                    }
                })),
                ELEMENT_NODE = 1;

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
        });
        it('should bind this in computed variables functions', function () {
            var template = '<div><h1>{{headline}}</h1></div>',
                view = new (IrLib.View.Template.extend({
                    template: template,
                    computed: {
                        headline: function () {
                            return this.variables.what + ' worked'
                        }
                    }
                })),
                ELEMENT_NODE = 1;

            view.variables = {
                what: 'This'
            };
            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
        });
        it('should treat variables of type function as computed variable', function () {
            var template = '<div><h1>{{meta.headline}}</h1></div>',
                view = new (IrLib.View.Template.extend({
                    template: template
                })),
                ELEMENT_NODE = 1;

            view.variables = {
                meta: {
                    headline: function () {
                        return 'This worked';
                    }
                }
            };
            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
        });
        it('should treat variables of type function as computed variable and pass the view as first argument', function () {
            var template = '<div><h1>{{meta.headline}}</h1></div>',
                view = new (IrLib.View.Template.extend({
                    template: template
                })),
                ELEMENT_NODE = 1;

            view.variables = {
                what: 'This',
                meta: {
                    headline: function (view) {
                        return view.variables.what + ' worked';
                    }
                }
            };
            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
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
            assert.strictEqual(result.innerHTML, '<div><h1>Headline</h1></div>');
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
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');
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
        it('should build DOM element with View in template', function () {
            var sl = new IrLib.ServiceLocator(),
                ELEMENT_NODE = 1,
                element = document.createElement('div'),
                view;

            sl.registerMultiple({
                mainView: (IrLib.View.Template.extend({
                    template: '<section>{%view header%}</section>'
                })),
                header: (IrLib.View.Template.extend({
                    template: '<h1>{{{headline}}}</h1>'
                }))
            });

            view = sl.get('mainView');
            view.setVariables({'headline': 'This <strong>worked</strong>'});

            view.appendTo(element);

            var result = element.firstChild;
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<section><div><h1>This <strong>worked</strong></h1></div></section>');
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
            assert.strictEqual(element.firstChild.innerHTML, '<div><h1>Headline</h1></div>');

            view.remove();

            assert.isNull(element.firstChild);
        });
        it('should remove the View from DOM and allow to append it afterwards', function () {
            var view = new IrLib.View.Template('<div><h1>Headline</h1></div>'),
                element = document.createElement('div');

            view.appendTo(element);
            assert.isDefined(element.firstChild);
            assert.strictEqual(element.firstChild.innerHTML, '<div><h1>Headline</h1></div>');

            view.remove();

            assert.isNull(element.firstChild);

            view.appendTo(element);
            assert.isNotNull(element.firstChild);
            assert.strictEqual(element.firstChild.innerHTML, '<div><h1>Headline</h1></div>');
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
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');

            view.variables = {'headline': 'Refreshed'};
            view.reload();

            result = element.firstChild;
            assert.isDefined(result);
            assert.strictEqual(result.innerHTML, '<div><h1>Refreshed</h1></div>');
        });
        it('should throw exception if not added to the DOM', function () {
            assert.throw(function () {
                var view = new (IrLib.View.Template.extend({
                        template: '<div><h1>{{headline}}</h1></div>'
                    })),
                    result;

                view.variables = {'headline': 'This worked'};
                result = view.render();
                assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');

                view.variables = {'headline': 'Refreshed'};
                result = view.render();
                assert.strictEqual(result.innerHTML, '<div><h1>Refreshed</h1></div>');
                result = view.reload();
                assert.strictEqual(result.innerHTML, '<div><h1>Refreshed</h1></div>');
            });
        });

        it('should update nested conditional in template', function () {
            var view = new IrLib.View.Template(
                '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setVariables({
                condition: true,
                innerCondition: true
            });

            view.appendTo(document.createElement('div'));
            assert.strictEqual(view._dom.innerHTML, '<section>Outer condition fulfilled inner Condition fulfilled</section>');

            view.variables.innerCondition = false;
            view.reload(true);
            assert.strictEqual(view._dom.innerHTML, '<section>Outer condition fulfilled</section>');
        });

        it('should update nested conditional with key path in template', function () {
            var view = new IrLib.View.Template(
                '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>'
            );

            view.setVariables({
                parameters: {
                    condition: true,
                    innerCondition: true
                }
            });

            view.appendTo(document.createElement('div'));
            assert.strictEqual(view._dom.innerHTML, '<section>Outer condition fulfilled inner Condition fulfilled</section>');

            view.variables.parameters.innerCondition = false;
            view.reload(true);
            assert.strictEqual(view._dom.innerHTML, '<section>Outer condition fulfilled</section>');
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
            it('should bind event listeners from inherited configuration', function () {
                var clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    element = document.createElement('div'),
                    view;

                view = new (IrLib.View.Template.extend({
                    template: '<div></div>',
                    eventListeners: {
                        drum: function (event) {
                            target = event.irTarget;
                            handler = this;
                            clicked = true;
                        }
                    }
                }))();

                view.appendTo(element);
                view.dispatchEvent(buildEvent('drum'));
                assert.isTrue(clicked, 'Child element was not clicked');
                assert.isFalse(keyPressed);
                assert.equal(target, view);
            });
            it('should bind event listeners from inherited events property', function () {
                var clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    element = document.createElement('div'),
                    view;

                view = new (IrLib.View.Template.extend({
                    template: '<div></div>',
                    events: {
                        drum: function (event) {
                            target = event.irTarget;
                            handler = this;
                            clicked = true;
                        }
                    }
                }))();

                view.appendTo(element);
                view.dispatchEvent(buildEvent('drum'));
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

                assert.strictEqual(view.render().lastChild, childNode);
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
