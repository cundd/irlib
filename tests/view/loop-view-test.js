/**
 * Created by daniel on 25.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('View.LoopView', function () {
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
        it('should throw for invalid template type', function () {
            //assert.throws(function() {
            //    new IrLib.View.LoopView(1);
            //});
            //assert.throws(function() {
            //    new IrLib.View.LoopView(1.0);
            //});
            assert.throws(function () {
                new IrLib.View.LoopView({});
            });
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
            for (var i = 500; i > 0; i--) {
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
        it('should repeat the View in template', function () {
            var sl = new IrLib.ServiceLocator(),
                view;

            sl.registerMultiple({
                loopView: IrLib.View.LoopView.extend({
                    template: '<section><div>{%view header%}</div></section>'
                }),
                header: IrLib.View.Template.extend({
                    template: '<h1>{{this.headline}}</h1>'
                })
            });

            view = sl.get('loopView');
            view.content = [
                {headline: 'Heading 1'},
                {headline: 'Heading 2'}
            ];

            var result = view.toString();
            assert.strictEqual(
                result,
                '<section><div><h1>Heading 1</h1></div></section>' +
                '<section><div><h1>Heading 2</h1></div></section>' +
                ''
            );
        });
        it('should repeat the template and replace computed variables', function () {
            var view = new IrLib.View.LoopView(
                '<section><div>{{headline}}</div></section>',
                [
                    {content: 'Content 1'},
                    {content: 'Content 2'},
                    {content: 'Content 3'}
                ]
                ),
                computed = {
                    headline: function () {
                        return this.variables['this'].content + ' worked'
                    }
                };

            view.setComputed(computed);

            var result = view.toString();
            assert.strictEqual(
                result,
                '<section><div>Content 1 worked</div></section>' +
                '<section><div>Content 2 worked</div></section>' +
                '<section><div>Content 3 worked</div></section>' +
                ''
            );
        });
    });

    describe('render()', function () {
        it('should build a DOM element', function () {
            var ELEMENT_NODE = 1,
                view = new IrLib.View.LoopView(
                    '<section>{{article.content}}</section>',
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
                '<div><section>Content 1</section></div>' +
                '<div><section>Content 2</section></div>' +
                '<div><section>Content 3</section></div>' +
                ''
            )
        });
        it('should repeat the template in reasonable time', function () {
            var ELEMENT_NODE = 1,
                view = new IrLib.View.LoopView('<section><div>{{article.content}}</div></section>', [], 'article'),
                content = [];
            for (var i = 500; i > 0; i--) {
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
                    '<section>' +
                    '{%if article.isImportant%}' +
                    '{{article.content}}' +
                    '{%endif%}' +
                    '</section>',
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
                '<div><section>Hello 1</section></div>' +
                '<div><section></section></div>' +
                '<div><section></section></div>' +
                '<div><section>Hello 4</section></div>' +
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
                '<div><section><div>Important: Hello 1!</div></section></div>' +
                '<div><section><div>Hello 2</div></section></div>' +
                '<div><section><div>Hello 3</div></section></div>' +
                '<div><section><div>Important: Hello 4!</div></section></div>' +
                ''
            )
        });
        it('should build a DOM element with conditions and else with template instance', function () {
            var ELEMENT_NODE = 1,
                view = new IrLib.View.LoopView(
                    new (IrLib.View.Template.extend({
                        template: '<div>' +
                        '{%if article.isImportant%}' +
                        'Important: {{article.content}}!' +
                        '{%else%}' +
                        '{{article.content}}' +
                        '{%endif%}' +
                        '</div>',
                        tagName: 'section'
                    })),
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
        it('should render View in template', function () {
            var sl = new IrLib.ServiceLocator(),
                ELEMENT_NODE = 1,
                view;

            sl.registerMultiple({
                loopView: IrLib.View.LoopView.extend({
                    template: '<section>{%view header%}</section>'
                }),
                header: IrLib.View.Template.extend({
                    template: '<h1>{{this.headline}}</h1>'
                })
            });

            view = sl.get('loopView');
            view.content = [
                {headline: 'Heading 1'},
                {headline: 'Heading 2'}
            ];

            var result = view.render();
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(
                result.innerHTML,
                '<div><section><div><h1>Heading 1</h1></div></section></div>' +
                '<div><section><div><h1>Heading 2</h1></div></section></div>' +
                ''
            );
        });
        it('should throw if content is not set', function () {
            assert.throws(function () {
                (new IrLib.View.LoopView('<div></div>')).render();
            });
        });
    });
    describe('setVariables()', function () {
        it('should accept data with the "content" property', function () {
            var view = new IrLib.View.LoopView('<h1>Headline</h1>'),
                content = [{obj: 1}, {obj: 2}];

            view.setVariables({content: content});
            assert.strictEqual(view.content, content);
        });
        it('should throw for data with the "content" property not of type array', function () {
            assert.throws(function () {
                (new IrLib.View.LoopView('<div></div>')).setVariables({content: ""});
            });
        });
    });
    describe('appendTo()', function () {
        it('should build a DOM element and insert it to the parent', function () {
            var view = new IrLib.View.LoopView('<h1>Headline</h1>', [true, true]),
                element = document.createElement('div'),
                ELEMENT_NODE = 1;

            view.appendTo(element);

            var result = element.firstChild;
            assert.isDefined(result);
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>Headline</h1></div><div><h1>Headline</h1></div>');
        });
        it('should build a DOM element and replace variables', function () {
            var view = new IrLib.View.LoopView(
                    '<h1>{{this.headline}}</h1>',
                    [
                        {'headline': 'This worked'},
                        {'headline': 'This worked too'}
                    ]
                ),
                element = document.createElement('div'),
                ELEMENT_NODE = 1;

            view.appendTo(element);

            var result = element.firstChild;
            assert.isDefined(result);
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div><div><h1>This worked too</h1></div>');
        });
        it('should use the result from render()', function () {
            var view = new IrLib.View.LoopView('<h1>Headline</h1>', [true, true]),
                element = document.createElement('div');

            view.appendTo(element);

            var result = element.firstChild;
            assert.strictEqual(result, view.render());
            assert.strictEqual(result, view._dom);
            assert.strictEqual(result, view._lastInsertedNode);
        });
        it('should build DOM element with View in template', function () {
            var sl = new IrLib.ServiceLocator(),
                element = document.createElement('div'),
                ELEMENT_NODE = 1,
                view;

            sl.registerMultiple({
                loopView: IrLib.View.LoopView.extend({
                    template: '<div class="header">{%view header%}</div>'
                }),
                header: IrLib.View.Template.extend({
                    tagName: 'h1',
                    template: '{{this.headline}}'
                })
            });

            view = sl.get('loopView');
            view.content = [
                {headline: 'Heading 1'},
                {headline: 'Heading 2'}
            ];

            view.appendTo(element);

            var result = element.firstChild;
            assert.strictEqual(result.nodeType, ELEMENT_NODE);
            assert.strictEqual(
                result.innerHTML,
                '<div><div class="header"><h1>Heading 1</h1></div></div>' +
                '<div><div class="header"><h1>Heading 2</h1></div></div>' +
                ''
            );
        });
        it('should throw an exception if the element is not a valid node', function () {
            var view = new IrLib.View.LoopView('<div><h1>{{headline}}</h1></div>');
            assert.throws(function () {
                view.appendTo({});
            });
        });
        it('should throw an exception if the element is not defined', function () {
            var view = new IrLib.View.LoopView('<div><h1>{{headline}}</h1></div>');
            assert.throws(function () {
                view.appendTo();
            });
        });
        it('should throw an exception if the template is not set', function () {
            var view = new IrLib.View.LoopView();
            assert.throws(function () {
                view.appendTo(document.createElement('div'));
            });
        });
    });
    describe('remove()', function () {
        it('should remove the View from DOM', function () {
            var view = new IrLib.View.LoopView('<h1>Headline</h1>', [true, true]),
                element = document.createElement('div');

            view.appendTo(element);
            assert.isDefined(element.firstChild);
            assert.strictEqual(element.firstChild.innerHTML, '<div><h1>Headline</h1></div><div><h1>Headline</h1></div>');

            view.remove();

            assert.isNull(element.firstChild);
        });
        it('should remove the View from DOM and allow to append it afterwards', function () {
            var view = new IrLib.View.LoopView('<h1>Headline</h1>', [true, true]),
                element = document.createElement('div');

            view.appendTo(element);
            assert.isDefined(element.firstChild);
            assert.strictEqual(element.firstChild.innerHTML, '<div><h1>Headline</h1></div><div><h1>Headline</h1></div>');

            view.remove();

            assert.isNull(element.firstChild);

            view.appendTo(element);
            assert.isNotNull(element.firstChild);
            assert.strictEqual(element.firstChild.innerHTML, '<div><h1>Headline</h1></div><div><h1>Headline</h1></div>');
        });
        it('should do nothing if not inserted', function () {
            (new IrLib.View.LoopView()).remove();
        });
    });
    describe('isVisible()', function () {
        it('should return false at initialization', function () {
            assert.isFalse((new IrLib.View.LoopView('<h1>Headline</h1>', [])).isVisible());
        });
        it('should return false if not added to the document', function () {
            var view = new IrLib.View.LoopView('<h1>Headline</h1>', []),
                element = document.createElement('div');

            view.appendTo(element);
            assert.isFalse(view.isVisible());
        });
        it('should return true if added to the visible DOM', function () {
            var view = new IrLib.View.LoopView('<h1>Headline</h1>', []),
                element = document.createElement('div');

            view.appendTo(element);
            getFixturesDivToEnableBubbling().appendChild(element);
            assert.isTrue(view.isVisible());
        });
    });
    describe('reload()', function () {
        it('should update the DOM element', function () {
            var view = new IrLib.View.LoopView('<h1>{{this.headline}}</h1>'),
                element = document.createElement('div'),
                result;

            view.content = [{'headline': 'This worked'}];
            view.appendTo(element);
            result = element.firstChild;
            assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');

            view.content = [{'headline': 'Refreshed'}];
            view.reload();

            result = element.firstChild;
            assert.isDefined(result);
            assert.strictEqual(result.innerHTML, '<div><h1>Refreshed</h1></div>');
        });
        it('should throw exception if not added to the DOM', function () {
            assert.throw(function () {
                var view = new (IrLib.View.LoopView.extend({
                        template: '<h1>{{this.headline}}</h1>',
                        content: [{'headline': 'This worked'}]
                    })),
                    result;

                result = view.render();
                assert.strictEqual(result.innerHTML, '<div><h1>This worked</h1></div>');

                view.content = [{'headline': 'Refreshed'}];
                view.reload();
            }, ReferenceError, 'Can not reload because the view does not seem to be in the DOM');
        });

        it('should update nested conditional in template', function () {
            var view = new IrLib.View.LoopView(
                '<section>{%if this.condition%}Outer condition fulfilled{%if this.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>'
            );
            view.setContent([
                {
                    condition: true,
                    innerCondition: true
                },
                {
                    condition: true,
                    innerCondition: true
                }
            ]);

            view.appendTo(document.createElement('div'));
            assert.strictEqual(
                view._dom.innerHTML,
                '<div><section>Outer condition fulfilled inner Condition fulfilled</section></div>' +
                '<div><section>Outer condition fulfilled inner Condition fulfilled</section></div>' +
                ''
            );

            view.content[0].innerCondition = false;
            view.reload(true);
            assert.strictEqual(
                view._dom.innerHTML,
                '<div><section>Outer condition fulfilled</section></div>' +
                '<div><section>Outer condition fulfilled inner Condition fulfilled</section></div>' +
                ''
            );
        });

        it('should update nested conditional in template with nested parameters', function () {
            var view = new IrLib.View.LoopView(
                '<section>{%if this.parameters.condition%}Outer condition fulfilled{%if this.parameters.innerCondition%} inner Condition fulfilled{%endif%}{%endif%}</section>');
            view.setContent([{
                parameters: {
                    condition: true,
                    innerCondition: true
                }
            }]);

            view.appendTo(document.createElement('div'));
            assert.strictEqual(view._dom.innerHTML, '<div><section>Outer condition fulfilled inner Condition fulfilled</section></div>');

            view.content[0].parameters.innerCondition = false;
            view.reload(true);
            assert.strictEqual(view._dom.innerHTML, '<div><section>Outer condition fulfilled</section></div>');
        });
    });

    if (TestRunner.name !== 'mocha-cli') {
        describe('addEventListener()', function () {
            it('should bind event listeners', function () {
                var view = new IrLib.View.LoopView('<div></div>', [true]),
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
                var view = new IrLib.View.LoopView('<div></div>', [true]),
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
                var view = new IrLib.View.LoopView('<div></div>', [true]),
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
                var view = new IrLib.View.LoopView('<div>{{content}}</div>', [{content: 'hello'}]),
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

                getFixturesDivToEnableBubbling().appendChild(view.render());

                view.addEventListener('click', callback);

                view.content = [{content: 'new content'}];
                view.reload();

                view._dom.dispatchEvent(buildEvent('click'));
                assert.equal(clicked, 1);
                assert.isFalse(keyPressed);
                assert.equal(target, view);
            });
        });
    }
});
