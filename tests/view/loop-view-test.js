/**
 * Created by daniel on 25.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('View.LoopView', function () {
    bootstrapDocument();

    var getFixturesDivToEnableBubbling = function () {
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
                view = new IrLib.View.LoopView(template);
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.template._template, template);
        });
        it('should take the first element as template (selector)', function () {
            var template = '#my-template',
                view;
            createTemplateDom(template);
            view = new IrLib.View.LoopView(template);
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.template._template, getTemplateDomString());
        });
        it('should take the first element as template (View)', function () {
            var template = new IrLib.View.Template('<div><h1>Heading</h1></div>'),
                view = new IrLib.View.LoopView(template);
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.template, template);
        });
        it('should inherit the template (string)', function () {
            var template = '<div><h1>Heading</h1></div>',
                view = new (IrLib.View.LoopView.extend({
                    template: template
                }));
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.template._template, template);
        });
        it('should inherit the template (selector)', function () {
            var template = '#my-template',
                view;
            createTemplateDom(template);
            view = new (IrLib.View.LoopView.extend({
                template: template
            }));
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.template._template, getTemplateDomString());
        });
    });
    describe('setTemplate()', function () {
        it('should overwrite the template and set needsRedraw (string)', function () {
            var view = new IrLib.View.LoopView(),
                template = '<div><h1>Heading</h1></div>';

            view.setTemplate(template);
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.needsRedraw, true);
        });
        it('should overwrite the template and set needsRedraw (selector)', function () {
            var template = '#my-template',
                view = new IrLib.View.LoopView();
            createTemplateDom(template);
            view.setTemplate(template);
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.needsRedraw, true);
        });
    });
    describe('template=', function () {
        it('should overwrite the template and set needsRedraw', function () {
            var view = new IrLib.View.LoopView(),
                template = '<div><h1>Heading</h1></div>';

            view.template = template;
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.template._template, template);
            assert.strictEqual(view.needsRedraw, true);
        });
        it('should overwrite the template and set needsRedraw (selector)', function () {
            var template = '#my-template',
                view = new IrLib.View.LoopView();
            createTemplateDom(template);

            view.template = template;
            assert.instanceOf(view.template, IrLib.View.Interface);
            assert.strictEqual(view.template._template, getTemplateDomString());
            assert.strictEqual(view.needsRedraw, true);
        });
    });
    describe('setContent()', function () {
        it('should overwrite previous content', function () {
            var content = [{'key': 'value1'}, {'key': 'value2'}],
                initialContent = [{'key': 'initial content'}],
                view = new (IrLib.View.LoopView.extend({
                    content: initialContent
                }));

            assert.strictEqual(view._content, initialContent);
            view.setContent(content);
            assert.strictEqual(view._content, content);
        });
    });
    describe('content=', function () {
        it('should overwrite previous content', function () {
            var content = [{'key': 'value1'}, {'key': 'value2'}],
                initialContent = [{'key': 'initial content'}],
                view = new (IrLib.View.LoopView.extend({
                    content: initialContent
                }));

            assert.strictEqual(view._content, initialContent);
            view.content = content;
            assert.strictEqual(view._content, content);
        });
    });
    describe('getContent()', function () {
        it('should return initial content', function () {
            var initialContent = [{'key': 'initial content'}],
                view = new (IrLib.View.LoopView.extend({
                    content: initialContent
                }));

            assert.strictEqual(view.getContent(), initialContent);
        });
    });
    describe('=content', function () {
        it('should return initial content', function () {
            var initialContent = [{'key': 'initial content'}],
                view = new (IrLib.View.LoopView.extend({
                    content: initialContent
                }));

            assert.strictEqual(view.content, initialContent);
        });
    });

    describe('setAsKey()', function () {
        it('should overwrite previous asKey', function () {
            var asKey = 'article',
                initialAsKey = 'story',
                view = new (IrLib.View.LoopView.extend({
                    asKey: initialAsKey
                }));

            assert.strictEqual(view._asKey, initialAsKey);
            view.setAsKey(asKey);
            assert.strictEqual(view._asKey, asKey);
        });
    });
    describe('asKey=', function () {
        it('should overwrite previous asKey', function () {
            var asKey = 'article',
                initialAsKey = 'story',
                view = new (IrLib.View.LoopView.extend({
                    asKey: initialAsKey
                }));

            assert.strictEqual(view._asKey, initialAsKey);
            view.asKey = asKey;
            assert.strictEqual(view._asKey, asKey);
        });
    });
    describe('getAsKey()', function () {
        it('should return initial asKey', function () {
            var view = new IrLib.View.LoopView();
            assert.strictEqual(view.getAsKey(), 'this');
        });
        it('should return inherited asKey', function () {
            var initialAsKey = 'story',
                view = new (IrLib.View.LoopView.extend({
                    asKey: initialAsKey
                }));

            assert.strictEqual(view.getAsKey(), initialAsKey);
        });
    });
    describe('=asKey', function () {
        it('should return initial asKey', function () {
            var view = new IrLib.View.LoopView();
            assert.strictEqual(view.asKey, 'this');
        });
        it('should return inherited asKey', function () {
            var initialAsKey = 'story',
                view = new (IrLib.View.LoopView.extend({
                    asKey: initialAsKey
                }));

            assert.strictEqual(view.asKey, initialAsKey);
        });
    });
    describe('setContext()', function () {
        it('should overwrite previous context', function () {
            var context = new IrLib.View.LoopView(),
                initialContext = new IrLib.View.LoopView(),
                view = new (IrLib.View.LoopView.extend({
                    context: initialContext
                }));

            assert.strictEqual(view._context, initialContext);
            view.setContext(context);
            assert.strictEqual(view._context, context);
        });
    });
    describe('context=', function () {
        it('should overwrite previous context', function () {
            var context = new IrLib.View.LoopView(),
                initialContext = new IrLib.View.LoopView(),
                view = new (IrLib.View.LoopView.extend({
                    context: initialContext
                }));

            assert.strictEqual(view._context, initialContext);
            view.context = context;
            assert.strictEqual(view._context, context);
        });
    });
    describe('getContext()', function () {
        it('should return initial context', function () {
            var initialContext = new IrLib.View.LoopView(),
                view = new (IrLib.View.LoopView.extend({
                    context: initialContext
                }));

            assert.strictEqual(view.getContext(), initialContext);
        });
    });
    describe('=context', function () {
        it('should return initial context', function () {
            var initialContext = new IrLib.View.LoopView(),
                view = new (IrLib.View.LoopView.extend({
                    context: initialContext
                }));

            assert.strictEqual(view.context, initialContext);
        });
    });
    describe('toString()', function () {
        it('should repeat the template', function () {
            var view = new IrLib.View.LoopView(
                '<section><div>{{article.content}}</div></section>',
                [
                    {content: 'Content 1'},
                    {content: 'Content 2'},
                    {content: 'Content 3'}
                ],
                'article'
            );

            var result = view.toString();
            assert.strictEqual(
                result,
                '<section><div>Content 1</div></section>' +
                '<section><div>Content 2</div></section>' +
                '<section><div>Content 3</div></section>' +
                ''
            );
        });
        it('should repeat the template in reasonable time', function () {
            var view = new IrLib.View.LoopView('<section><div>{{article.content}}</div></section>', [], 'article'),
                content = [];
            for (var i = 11500; i > 0; i--) {
                content.push({
                    content: 'Content ' + i
                });
            }

            view.content = content;
            assert.typeOf(view.toString(), 'string');
        });
        it('should repeat the template with conditions', function () {
            var view = new IrLib.View.LoopView(
                '<section><div>' +
                '{%if article.isImportant%}' +
                '{{article.content}}' +
                '{%endif%}' +
                '</div></section>',
                [
                    {'content': 'Hello 1', isImportant: true},
                    {'content': 'Hello 2', isImportant: false},
                    {'content': 'Hello 3', isImportant: false},
                    {'content': 'Hello 4', isImportant: true}
                ],
                'article'
            );

            var result = view.toString();
            assert.strictEqual(
                result,
                '<section><div>Hello 1</div></section>' +
                '<section><div></div></section>' +
                '<section><div></div></section>' +
                '<section><div>Hello 4</div></section>' +
                ''
            )
        });
        it('should repeat the template with conditions and else', function () {
            var view = new IrLib.View.LoopView(
                '<section><div>' +
                '{%if article.isImportant%}' +
                'Important: {{article.content}}!' +
                '{%else%}' +
                '{{article.content}}' +
                '{%endif%}' +
                '</div></section>',
                [
                    {'content': 'Hello 1', isImportant: true},
                    {'content': 'Hello 2', isImportant: false},
                    {'content': 'Hello 3', isImportant: false},
                    {'content': 'Hello 4', isImportant: true}
                ],
                'article'
            );

            var result = view.toString();
            assert.strictEqual(
                result,
                '<section><div>Important: Hello 1!</div></section>' +
                '<section><div>Hello 2</div></section>' +
                '<section><div>Hello 3</div></section>' +
                '<section><div>Important: Hello 4!</div></section>' +
                ''
            )
        });
    });

    describe('render()', function () {
        it('should build a DOM element', function () {
            var ELEMENT_NODE = 1,
                view = new IrLib.View.LoopView(
                    '<section><div>{{article.content}}</div></section>',
                    [
                        {content: 'Content 1'},
                        {content: 'Content 2'},
                        {content: 'Content 3'}
                    ],
                    'article'
                );

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML,
                '<section><div>Content 1</div></section>' +
                '<section><div>Content 2</div></section>' +
                '<section><div>Content 3</div></section>' +
                ''
            )
        });
        it('should repeat the template in reasonable time', function () {
            var ELEMENT_NODE = 1,
                view = new IrLib.View.LoopView('<section><div>{{article.content}}</div></section>', [], 'article'),
                content = [];
            for (var i = 11500; i > 0; i--) {
                content.push({
                    content: 'Content ' + i
                });
            }

            view.content = content;

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.typeOf(result.innerHTML, 'string');
        });
        it('should build a DOM element with conditions', function () {
            var ELEMENT_NODE = 1,
                view = new IrLib.View.LoopView(
                '<section><div>' +
                '{%if article.isImportant%}' +
                '{{article.content}}' +
                '{%endif%}' +
                '</div></section>',
                [
                    {'content': 'Hello 1', isImportant: true},
                    {'content': 'Hello 2', isImportant: false},
                    {'content': 'Hello 3', isImportant: false},
                    {'content': 'Hello 4', isImportant: true}
                ],
                'article'
            );

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML,
                '<section><div>Hello 1</div></section>' +
                '<section><div></div></section>' +
                '<section><div></div></section>' +
                '<section><div>Hello 4</div></section>' +
                ''
            )
        });
        it('should build a DOM element with conditions and else', function () {
            var ELEMENT_NODE = 1,
                view = new IrLib.View.LoopView(
                '<section><div>' +
                '{%if article.isImportant%}' +
                'Important: {{article.content}}!' +
                '{%else%}' +
                '{{article.content}}' +
                '{%endif%}' +
                '</div></section>',
                [
                    {'content': 'Hello 1', isImportant: true},
                    {'content': 'Hello 2', isImportant: false},
                    {'content': 'Hello 3', isImportant: false},
                    {'content': 'Hello 4', isImportant: true}
                ],
                'article'
            );

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML,
                '<section><div>Important: Hello 1!</div></section>' +
                '<section><div>Hello 2</div></section>' +
                '<section><div>Hello 3</div></section>' +
                '<section><div>Important: Hello 4!</div></section>' +
                ''
            )
        });
    });
    //    it('should build a DOM element and replace variables', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{headline}}</h1></div>'),
    //            variables = {'headline': 'This worked'},
    //            ELEMENT_NODE = 1;
    //
    //        view.setVariables(variables);
    //
    //        var result = view.render();
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
    //    });
    //    it('should build a DOM element and replace nested variables', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{meta.headline}}</h1></div>'),
    //            variables = {'meta': {'headline': 'This worked'}},
    //            ELEMENT_NODE = 1;
    //
    //        view.setVariables(variables);
    //
    //        var result = view.render();
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
    //    });
    //    it('should throw an exception if the template is not set', function () {
    //        var view = new IrLib.View.LoopView();
    //        assert.throws(function () {
    //            view.render();
    //        });
    //    });
    //    it('should trim whitespaces', function () {
    //        var view = new IrLib.View.LoopView("    \t\n<div><h1>Headline</h1></div> "),
    //            ELEMENT_NODE = 1;
    //
    //        var result = view.render();
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<h1>Headline</h1>')
    //
    //    });
    //    it('should inherit the template (string)', function () {
    //        var template = '<div><h1>{{headline}}</h1></div>',
    //            view = new (IrLib.View.LoopView.extend({
    //                template: template
    //            })),
    //            variables = {'headline': 'This worked'},
    //            ELEMENT_NODE = 1;
    //
    //        view.setVariables(variables);
    //        var result = view.render();
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
    //    });
    //    it('should inherit the template (selector)', function () {
    //        var template = '#my-template',
    //            variables = {'headline': 'This worked'},
    //            ELEMENT_NODE = 1,
    //            view;
    //
    //        createTemplateDom(template);
    //        view = new (IrLib.View.LoopView.extend({
    //            template: template
    //        }));
    //
    //        view.setVariables(variables);
    //        var result = view.render();
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<header>This worked</header><section>My content</section>');
    //    });
    //    it('should escape variable content', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{headline}}</h1></div>'),
    //            variables = {'headline': 'This <strong>worked</strong>'},
    //            ELEMENT_NODE = 1;
    //
    //        view.setVariables(variables);
    //
    //        var result = view.render();
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<h1>This &lt;strong&gt;worked&lt;/strong&gt;</h1>');
    //    });
    //    it('should not escape variable content', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{{headline}}}</h1></div>'),
    //            variables = {'headline': 'This <strong>worked</strong>'},
    //            ELEMENT_NODE = 1;
    //
    //        view.setVariables(variables);
    //
    //        var result = view.render();
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<h1>This <strong>worked</strong></h1>');
    //    });
    //    it('should not render empty for undefined variables', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{{headline}}}</h1></div>');
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, '<h1></h1>');
    //    });
    //    it('should not throw for undefined variables', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{{meta.headline}}}</h1></div>');
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, '<h1></h1>');
    //    });
    //    it('should render View in template', function () {
    //        var sl = new IrLib.ServiceLocator(),
    //            ELEMENT_NODE = 1,
    //            view;
    //
    //        sl.registerMultiple({
    //            mainView: (IrLib.View.LoopView.extend({
    //                template: '<section><div>{%view header%}</div></section>'
    //            })),
    //            header: (IrLib.View.LoopView.extend({
    //                template: '<h1>{{{headline}}}</h1>'
    //            }))
    //        });
    //
    //        view = sl.get('mainView');
    //        view.setVariables({'headline': 'This <strong>worked</strong>'});
    //
    //        var result = view.render();
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<div><h1>This <strong>worked</strong></h1></div>');
    //    });
    //    it('should render conditional in template', function () {
    //        var view = new IrLib.View.LoopView('<section>{%if condition%}Condition fulfilled{%endif%}</section>');
    //        view.setVariables({condition: true});
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'Condition fulfilled');
    //    });
    //    it('should render conditional empty in template', function () {
    //        var view = new IrLib.View.LoopView('<section>{%if condition%}Condition fulfilled{%endif%}</section>');
    //        view.setVariables({condition: false});
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, '');
    //    });
    //    it('should throw for missing condition', function () {
    //        var view = new IrLib.View.LoopView('<section>{%if%}Condition fulfilled{%endif%}</section>');
    //        view.setVariables({condition: true});
    //
    //        assert.throws(function () {
    //            view.render();
    //        });
    //    });
    //    it('should render else in template', function () {
    //        var view = new IrLib.View.LoopView('<section>{%if condition%}Condition fulfilled{%else%}else statement{%endif%}</section>');
    //        view.setVariables({condition: false});
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'else statement');
    //    });
    //    it('should not render else in template', function () {
    //        var view = new IrLib.View.LoopView('<section>{%if condition%}Condition fulfilled{%else%}not fulfilled{%endif%}</section>');
    //        view.setVariables({condition: true});
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'Condition fulfilled');
    //    });
    //    it('should handle nested if-else in template', function () {
    //        var view = new IrLib.View.LoopView('<section>{%if condition%}Outer condition fulfilled{%else%}Outer not fulfilled{%if inner.condition%} inner condition fulfilled{%else%} inner else{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            condition: false,
    //            inner: {
    //                condition: true
    //            }
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.outerHTML, '<section>Outer not fulfilled inner condition fulfilled</section>');
    //    });
    //    it('should render nested conditional in template (true / true)', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            condition: true,
    //            innerCondition: true
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'Outer condition fulfilled inner Condition fulfilled');
    //    });
    //    it('should render nested conditional in template (true / false)', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            condition: true,
    //            innerCondition: false
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'Outer condition fulfilled');
    //    });
    //    it('should render nested conditional empty in template (false / false)', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            condition: false,
    //            innerCondition: false
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, '');
    //    });
    //    it('should render nested conditional empty in template (false/ true)', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            condition: false,
    //            innerCondition: true
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, '');
    //    });
    //    it('should render nested conditional with key path in template (true / true)', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            parameters: {
    //                condition: true,
    //                innerCondition: true
    //            }
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'Outer condition fulfilled inner Condition fulfilled');
    //    });
    //    it('should render nested conditional with key path in template (true / false)', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            parameters: {
    //                condition: true,
    //                innerCondition: false
    //            }
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'Outer condition fulfilled');
    //    });
    //    it('should render nested conditional with key path empty in template (false / false)', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            parameters: {
    //                condition: false,
    //                innerCondition: false
    //            }
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, '');
    //    });
    //    it('should render nested conditional with key path empty in template (false/ true)', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            parameters: {
    //                condition: false,
    //                innerCondition: true
    //            }
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, '');
    //    });
    //});
    //
    //describe('appendTo()', function () {
    //    it('should build a DOM element and insert it to the parent', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>Headline</h1></div>'),
    //            element = document.createElement('div'),
    //            ELEMENT_NODE = 1;
    //
    //        view.appendTo(element);
    //
    //        var result = element.firstChild;
    //        assert.isDefined(result);
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<h1>Headline</h1>');
    //    });
    //    it('should build a DOM element and replace variables', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{headline}}</h1></div>'),
    //            variables = {'headline': 'This worked'},
    //            element = document.createElement('div'),
    //            ELEMENT_NODE = 1;
    //
    //        view.setVariables(variables);
    //
    //        view.appendTo(element);
    //
    //        var result = element.firstChild;
    //        assert.isDefined(result);
    //        assert.strictEqual(result.nodeType, ELEMENT_NODE);
    //        assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
    //    });
    //    it('should use the result from render()', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>Headline</h1></div>'),
    //            element = document.createElement('div');
    //
    //        view.appendTo(element);
    //
    //        var result = element.firstChild;
    //        assert.strictEqual(result, view.render());
    //        assert.strictEqual(result, view._dom);
    //        assert.strictEqual(result, view._lastInsertedNode);
    //    });
    //    it('should throw an exception if the element is not a valid node', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{headline}}</h1></div>');
    //        assert.throws(function () {
    //            view.appendTo({});
    //        });
    //    });
    //    it('should throw an exception if the element is not defined', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{headline}}</h1></div>');
    //        assert.throws(function () {
    //            view.appendTo();
    //        });
    //    });
    //    it('should throw an exception if the template is not set', function () {
    //        var view = new IrLib.View.LoopView();
    //        assert.throws(function () {
    //            view.appendTo(document.createElement('div'));
    //        });
    //    });
    //});
    //describe('remove()', function () {
    //    it('should remove the View from DOM', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>Headline</h1></div>'),
    //            element = document.createElement('div');
    //
    //        view.appendTo(element);
    //        assert.isDefined(element.firstChild);
    //        assert.strictEqual(element.firstChild.innerHTML, '<h1>Headline</h1>');
    //
    //        view.remove();
    //
    //        assert.isNull(element.firstChild);
    //    });
    //    it('should remove the View from DOM and allow to append it afterwards', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>Headline</h1></div>'),
    //            element = document.createElement('div');
    //
    //        view.appendTo(element);
    //        assert.isDefined(element.firstChild);
    //        assert.strictEqual(element.firstChild.innerHTML, '<h1>Headline</h1>');
    //
    //        view.remove();
    //
    //        assert.isNull(element.firstChild);
    //
    //        view.appendTo(element);
    //        assert.isNotNull(element.firstChild);
    //        assert.strictEqual(element.firstChild.innerHTML, '<h1>Headline</h1>');
    //    });
    //    it('should do nothing if not inserted', function () {
    //        (new IrLib.View.LoopView()).remove();
    //    });
    //});
    //describe('isVisible()', function () {
    //    it('should return false at initialization', function () {
    //        assert.isFalse((new IrLib.View.LoopView('<div><h1>Headline</h1></div>')).isVisible());
    //    });
    //    it('should return false if not added to the document', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>Headline</h1></div>'),
    //            element = document.createElement('div');
    //
    //        view.appendTo(element);
    //        assert.isFalse(view.isVisible());
    //    });
    //    it('should return true if added to the visible DOM', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>Headline</h1></div>'),
    //            element = document.createElement('div');
    //
    //        view.appendTo(element);
    //        getFixturesDivToEnableBubbling().appendChild(element);
    //        assert.isTrue(view.isVisible());
    //    });
    //});
    //describe('reload()', function () {
    //    it('should update the DOM element', function () {
    //        var view = new IrLib.View.LoopView('<div><h1>{{headline}}</h1></div>'),
    //            element = document.createElement('div'),
    //            result;
    //
    //        view.variables = {'headline': 'This worked'};
    //        view.appendTo(element);
    //        result = element.firstChild;
    //        assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
    //
    //        view.variables = {'headline': 'Refreshed'};
    //        view.reload();
    //
    //        result = element.firstChild;
    //        assert.isDefined(result);
    //        assert.strictEqual(result.innerHTML, '<h1>Refreshed</h1>');
    //    });
    //    it('should throw exception if not added to the DOM', function () {
    //        assert.throw(function () {
    //            var view = new (IrLib.View.LoopView.extend({
    //                    template: '<div><h1>{{headline}}</h1></div>'
    //                })),
    //                result;
    //
    //            view.variables = {'headline': 'This worked'};
    //            result = view.render();
    //            assert.strictEqual(result.innerHTML, '<h1>This worked</h1>');
    //
    //            view.variables = {'headline': 'Refreshed'};
    //            result = view.render();
    //            assert.strictEqual(result.innerHTML, '<h1>Refreshed</h1>');
    //            result = view.reload();
    //            assert.strictEqual(result.innerHTML, '<h1>Refreshed</h1>');
    //        });
    //    });
    //
    //    it('should update nested conditional in template', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if condition%}Outer condition fulfilled{%if innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            condition: true,
    //            innerCondition: true
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'Outer condition fulfilled inner Condition fulfilled');
    //
    //        view.variables.innerCondition = false;
    //        result = view.reload(true)._dom;
    //        assert.strictEqual(result.innerHTML, 'Outer condition fulfilled');
    //    });
    //
    //    it('should update nested conditional in template', function () {
    //        var view = new IrLib.View.LoopView(
    //            '<section>{%if parameters.condition%}Outer condition fulfilled{%if parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
    //        view.setVariables({
    //            parameters: {
    //                condition: true,
    //                innerCondition: true
    //            }
    //        });
    //
    //        var result = view.render();
    //        assert.strictEqual(result.innerHTML, 'Outer condition fulfilled inner Condition fulfilled');
    //
    //        view.variables.parameters.innerCondition = false;
    //        result = view.reload(true)._dom;
    //        assert.strictEqual(result.innerHTML, 'Outer condition fulfilled');
    //    });
    //});
    //
    //if (TestRunner.name !== 'mocha-cli') {
    //    describe('addEventListener()', function () {
    //        it('should bind event listeners', function () {
    //            var view = new IrLib.View.LoopView('<div></div>'),
    //                clicked = false,
    //                keyPressed = false,
    //                handler = null,
    //                target = null;
    //
    //            view.addEventListener('click', function (event) {
    //                target = event.irTarget;
    //                handler = this;
    //                clicked = true;
    //            });
    //
    //            view.dispatchEvent(buildEvent('click'));
    //            assert.isTrue(clicked, 'Child element was not clicked');
    //            assert.isFalse(keyPressed);
    //            assert.equal(target, view);
    //        });
    //        it('should handle bubbled events', function () {
    //            var view = new IrLib.View.LoopView('<div></div>'),
    //                childNode = document.createElement('span'),
    //                clicked = false,
    //                keyPressed = false,
    //                handler = null,
    //                target = null,
    //                irTarget = null,
    //                viewDom;
    //
    //            viewDom = view.render();
    //            viewDom.appendChild(childNode);
    //            getFixturesDivToEnableBubbling().appendChild(viewDom);
    //
    //            view.addEventListener('click', function (event) {
    //                target = event.target;
    //                irTarget = event.irTarget;
    //                handler = this;
    //                clicked = true;
    //            });
    //
    //            childNode.dispatchEvent(buildEvent('click'));
    //
    //            assert.strictEqual(view.render().firstChild, childNode);
    //            assert.isTrue(clicked, 'Child element was not clicked');
    //            assert.isFalse(keyPressed, 'A key has been pressed');
    //            assert.equal(target, childNode);
    //            assert.equal(irTarget, view);
    //        });
    //        it('should invoke event methods only once', function () {
    //            var view = new IrLib.View.LoopView('<div></div>'),
    //                clicked = 0,
    //                keyPressed = false,
    //                handler = null,
    //                target = null,
    //                callback;
    //
    //            callback = function (event) {
    //                target = event.irTarget;
    //                handler = this;
    //                clicked = true;
    //            };
    //            view.addEventListener('click', callback);
    //            view.addEventListener('click', callback);
    //            view.addEventListener('click', callback);
    //            view.addEventListener('click', callback);
    //
    //            view.dispatchEvent(buildEvent('click'));
    //            assert.equal(clicked, 1);
    //            assert.isFalse(keyPressed);
    //            assert.equal(target, view);
    //        });
    //        it('should invoke event methods after reload', function () {
    //            var view = new IrLib.View.LoopView('<div>{{content}}</div>', {content: 'hello'}),
    //                clicked = 0,
    //                keyPressed = false,
    //                handler = null,
    //                target = null,
    //                callback;
    //
    //            callback = function (event) {
    //                target = event.irTarget;
    //                handler = this;
    //                clicked = true;
    //            };
    //
    //            //view.appendTo(getFixturesDivToEnableBubbling());
    //            getFixturesDivToEnableBubbling().appendChild(view.render());
    //
    //            view.addEventListener('click', callback);
    //
    //            view.variables = {content: 'new content'};
    //            view.reload();
    //
    //            view._dom.dispatchEvent(buildEvent('click'));
    //            assert.equal(clicked, 1);
    //            assert.isFalse(keyPressed);
    //            assert.equal(target, view);
    //        });
    //    });
    //}
});
