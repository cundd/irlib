/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('Controller', function () {
    bootstrapDocument();

    var buildEvent = function (eventName, controller) {
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
            if (controller) {
                event.irController = controller;
            }
            return event;
        },
        getFixturesDivToEnableBubbling = function () {
            return document.getElementById('mocha-fixtures');
        };

    describe('=view', function () {
        it('should return the initialization parameter (div)', function () {
            var view = document.createElement('div');
            var controller = new IrLib.Controller(view);
            assert.strictEqual(controller.view, view);
        });
        it('should return the initialization parameter as DOM element (selector)', function () {
            var selector = '#my-id';
            var controller = new IrLib.Controller(selector);
            assert.strictEqual(controller.view, document.querySelector(selector));
            assert.strictEqual(controller.view.id, selector.substr(1));
        });

        it('should return the initialization parameter (div)', function () {
            var view = document.createElement('div');
            var controller = new (IrLib.Controller.extend({
                view: view
            }));
            assert.strictEqual(controller.view, view);
        });
        it('should return the initialization parameter (selector)', function () {
            var selector = '#my-id';
            var controller = new (IrLib.Controller.extend({
                view: selector
            }));
            assert.strictEqual(controller.view, document.querySelector(selector));
        });
        it('should throw for invalid initialization parameter', function () {
            assert.throws(function () {
                new (IrLib.Controller.extend({
                    view: 'something bad'
                }));
            });
        });
    });

    describe('setView()', function () {
        it('should set the view (div)', function () {
            var view = document.createElement('div');
            var controller = new IrLib.Controller();
            controller.setView(view);
            assert.strictEqual(controller.view, view);
        });
        it('should set the view and resolve selectors', function () {
            var selector = '#my-id';
            var controller = new IrLib.Controller();
            controller.setView(selector);
            assert.strictEqual(controller.view, document.querySelector(selector));
            assert.strictEqual(controller.view.id, selector.substr(1));
        });
        it('should throw for invalid parameters (constructor)', function () {
            assert.throws(function () {
                new IrLib.Controller('something bad');
            });
        });
        it('should throw for invalid parameters', function () {
            var controller = new IrLib.Controller();
            assert.throws(function () {
                controller.setView('something bad');
            });
        });
    });

    describe('view=', function () {
        it('should set the view (div)', function () {
            var view = document.createElement('div');
            var controller = new IrLib.Controller();
            controller.view = view;
            assert.strictEqual(controller.view, view);
        });
        it('should set the view and resolve selectors', function () {
            var selector = '#my-id';
            var controller = new IrLib.Controller();
            controller.view = selector;
            assert.strictEqual(controller.view, document.querySelector(selector));
            assert.strictEqual(controller.view.id, selector.substr(1));
        });
        it('should throw for invalid parameters (constructor)', function () {
            assert.throws(function () {
                new IrLib.Controller('something bad');
            });
        });
        it('should throw for invalid parameters', function () {
            var controller = new IrLib.Controller();
            assert.throws(function () {
                controller.view = 'something bad';
            });
        });
    });

    describe('eventNames()', function () {
        it('should return all keys of the controllers "events" property', function () {
            var controller = new (IrLib.Controller.extend({
                events: {
                    'click'() {
                    },
                    'keydown'() {
                    }
                }
            }));
            assert.sameMembers(controller.eventNames(), ['click', 'keydown']);
        });
    });

    describe('initializeEventListeners()', function () {
        var doSkip = (TestRunner.name !== 'mocha-cli') ? it : it.skip;

        it('should bind event listeners (div)', function () {
            var domNode = document.createElement('div'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;
            getFixturesDivToEnableBubbling().appendChild(domNode);

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click'(event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();

            domNode.dispatchEvent(buildEvent('click', controller));
            assert.isTrue(clicked, 'Element should have been clicked');
            assert.isFalse(keyPressed);
            assert.equal(handler, controller);
            assert.equal(target, domNode);
        });
        it('should bind event listeners (selector)', function () {
            var domNode = document.querySelector('#my-id'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click'(event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();

            domNode.dispatchEvent(buildEvent('click', controller));
            assert.isTrue(clicked);
            assert.isFalse(keyPressed);
            assert.equal(handler, controller);
            assert.equal(target, domNode);
        });
        it('should handle bubbled events (div)', function () {
            var domNode = document.createElement('div'),
                childNode = document.createElement('span'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            domNode.appendChild(childNode);
            getFixturesDivToEnableBubbling().appendChild(domNode);

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click'(event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();

            childNode.dispatchEvent(buildEvent('click', controller));
            assert.isTrue(clicked);
            assert.isFalse(keyPressed);
            assert.equal(handler, controller);
            assert.equal(target, childNode);
        });
        it('should handle bubbled events (selector)', function () {
            var domNode = document.querySelector('#my-id'),
                childNode = document.createElement('span'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            domNode.appendChild(childNode);

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click'(event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }

                }
            }));
            controller.initializeEventListeners();

            childNode.dispatchEvent(buildEvent('click', controller));
            assert.isTrue(clicked);
            assert.isFalse(keyPressed);
            assert.equal(target, childNode);
            assert.equal(handler, controller);
        });
        it('should invoke event methods only once', function () {
            var domNode = document.createElement('div'),
                clicked = 0,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            getFixturesDivToEnableBubbling().appendChild(domNode);

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click'(event) {
                        target = event.target;
                        handler = this;
                        clicked++;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();
            controller.initializeEventListeners();
            controller.initializeEventListeners();

            domNode.dispatchEvent(buildEvent('click', controller));
            assert.isTrue(clicked > 0, 'Element should have been clicked');
            assert.equal(clicked, 1);
            assert.isFalse(keyPressed);
            assert.equal(handler, controller);
            assert.equal(target, domNode);
        });
        it('should bind event listeners with data-irlib-target (div)', function () {
            var domNode = document.createElement('div'),
                clicked = 0,
                keyPressed = false,
                handler = null,
                target = null,
                linkWithTarget, linkWithoutTarget, controller;

            linkWithTarget = document.createElement('a');
            linkWithTarget.setAttribute('data-irlib-target', 'action');
            domNode.appendChild(linkWithTarget);

            linkWithoutTarget = document.createElement('a');
            domNode.appendChild(linkWithoutTarget);

            getFixturesDivToEnableBubbling().appendChild(domNode);

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click:action'(event) {
                        target = event.target;
                        handler = this;
                        clicked++;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();

            linkWithoutTarget.dispatchEvent(buildEvent('click', controller));
            assert.strictEqual(clicked, 0, 'Element should not have been clicked');
            assert.isFalse(keyPressed);
            assert.isNull(handler);
            assert.isNull(target);

            linkWithTarget.dispatchEvent(buildEvent('click', controller));
            assert.strictEqual(clicked, 1, 'Element should have been clicked');
            assert.isFalse(keyPressed);
            assert.equal(handler, controller);
            assert.equal(target, linkWithTarget);
        });
        doSkip('should bind event listeners with data-irlib-target (selector)', function () {
            var domNode = document.querySelector('#my-id-with-irlib-target'),
                clicked = 0,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click:my-target'(event) {
                        target = event.target;
                        handler = this;
                        clicked++;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();

            domNode.dispatchEvent(buildEvent('click', controller));
            assert.strictEqual(clicked, 1);
            assert.isFalse(keyPressed);
            assert.equal(handler, controller);
            assert.equal(target, domNode);
        });
        it('should not bubble with data-irlib-target (div)', function () {
            var domNode = document.createElement('div'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
            span, linkWithTarget, controller;

            span = document.createElement('span');
            span.innerText = 'I am a link';

            linkWithTarget = document.createElement('a');
            linkWithTarget.setAttribute('data-irlib-target', 'action');
            linkWithTarget.appendChild(span);
            domNode.appendChild(linkWithTarget);

            getFixturesDivToEnableBubbling().appendChild(domNode);

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click:action'(event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();

            span.dispatchEvent(buildEvent('click', controller));
            assert.isFalse(clicked);
            assert.isFalse(keyPressed);
            assert.isNull(handler);
            assert.isNull(target);
        });
        it('should bind event listeners and prefer with data-irlib-target over unspecified (div)', function () {
            var domNode = document.createElement('div'),
                clickWithActionOccurred = false,
                clickWithoutActionOccurred = false,
                target = null,
                linkWithTarget, controller;

            linkWithTarget = document.createElement('a');
            linkWithTarget.setAttribute('data-irlib-target', 'action');
            domNode.appendChild(linkWithTarget);

            getFixturesDivToEnableBubbling().appendChild(domNode);

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    click: function() {
                        clickWithoutActionOccurred = true;
                    },
                    'click:action'() {
                        clickWithActionOccurred = true;
                    }
                }
            }));
            controller.initializeEventListeners();

            linkWithTarget.dispatchEvent(buildEvent('click', controller));
            assert.isTrue(clickWithActionOccurred, 'Element with irlib-target should have been clicked');
            assert.isFalse(clickWithoutActionOccurred, 'Element without the irlib-target attribute should not have been clicked');
        });
    });

    if (TestRunner.name !== 'mocha-cli') {

        describe('catchAllViewEvents()', function () {
            it('should bind event listeners (div)', function () {
                var domNode = document.createElement('div'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;
                getFixturesDivToEnableBubbling().appendChild(domNode);

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    handleEvent(event) {
                        if (event.type == 'click') {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        }
                    },
                    events: {
                        'click'(event) {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        },
                        'keydown'() {
                            keyPressed = true;
                        }
                    }
                }));
                controller.catchAllViewEvents();

                domNode.dispatchEvent(buildEvent('click', controller));
                assert.isTrue(clicked, 'Element should have been clicked');
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, domNode);
            });
            it('should bind event listeners (selector)', function () {
                var domNode = document.querySelector('#my-id'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    handleEvent(event) {
                        if (event.type == 'click') {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        }
                    },
                    events: {
                        'keydown'() {
                            keyPressed = true;
                        }
                    }
                }));
                controller.catchAllViewEvents();

                domNode.dispatchEvent(buildEvent('click', controller));
                assert.isTrue(clicked);
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, domNode);
            });
            it('should bind event listeners with data-irlib-target (div)', function () {
                var domNode = document.createElement('div'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    linkWithTarget, linkWithoutTarget, controller;

                linkWithTarget = document.createElement('a');
                linkWithTarget.setAttribute('data-irlib-target', 'action');
                domNode.appendChild(linkWithTarget);

                linkWithoutTarget = document.createElement('a');
                domNode.appendChild(linkWithoutTarget);

                getFixturesDivToEnableBubbling().appendChild(domNode);

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    events: {
                        'click:action'(event) {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        },
                        'keydown'() {
                            keyPressed = true;
                        }
                    }
                }));
                controller.catchAllViewEvents();

                linkWithoutTarget.dispatchEvent(buildEvent('click', controller));
                assert.isFalse(clicked, 'Element should not have been clicked');
                assert.isFalse(keyPressed);
                assert.isNull(handler);
                assert.isNull(target);

                linkWithTarget.dispatchEvent(buildEvent('click', controller));
                assert.isTrue(clicked, 'Element should have been clicked');
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, linkWithTarget);
            });
            it('should handle bubbled events (div)', function () {
                var domNode = document.createElement('div'),
                    childNode = document.createElement('span'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                domNode.appendChild(childNode);
                getFixturesDivToEnableBubbling().appendChild(domNode);

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    handleEvent(event) {
                        if (event.type == 'click') {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        }
                    },
                    events: {
                        'keydown'() {
                            keyPressed = true;
                        }
                    }
                }));
                controller.catchAllViewEvents();

                childNode.dispatchEvent(buildEvent('click', controller));
                assert.isTrue(clicked);
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, childNode);
            });
            it('should handle bubbled events (selector)', function () {
                var domNode = document.querySelector('#my-id'),
                    childNode = document.createElement('span'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                domNode.appendChild(childNode);

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    handleEvent(event) {
                        if (event.type == 'click') {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        }
                    },
                    events: {
                        'keydown'() {
                            keyPressed = true;
                        }

                    }
                }));
                controller.catchAllViewEvents();

                childNode.dispatchEvent(buildEvent('click', controller));
                assert.isTrue(clicked);
                assert.isFalse(keyPressed);
                assert.equal(target, childNode);
                assert.equal(handler, controller);
            });
            it('should invoke event methods only once', function () {
                var domNode = document.createElement('div'),
                    clicked = 0,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                getFixturesDivToEnableBubbling().appendChild(domNode);

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    handleEvent(event) {
                        if (event.type == 'click') {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        }
                    },
                    events: {
                        'keydown'() {
                            keyPressed = true;
                        }
                    }
                }));
                controller.catchAllViewEvents();
                controller.catchAllViewEvents();
                controller.catchAllViewEvents();

                domNode.dispatchEvent(buildEvent('click', controller));
                assert.isTrue(clicked > 0, 'Element should have been clicked');
                assert.equal(clicked, 1);
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, domNode);
            });
        });
    }
    describe('removeEventListeners()', function () {
        var doSkip = (TestRunner.name !== 'mocha-cli') ? it : it.skip;

        doSkip('should unbind event listeners (selector)', function () {
            var domNode = document.querySelector('#my-id'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click'(event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();

            controller.removeEventListeners();

            domNode.dispatchEvent(buildEvent('click', controller));
            assert.isFalse(clicked, 'Element click should not trigger event callback');
            assert.isFalse(keyPressed, 'Key should not have been pressed');
            assert.isNull(handler);
            assert.isNull(target);
        });
        it('should unbind event listeners (div)', function () {
            var domNode = document.createElement('div'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click'(event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown'() {
                        keyPressed = true;
                    }
                }
            }));

            controller.initializeEventListeners();
            controller.removeEventListeners();

            domNode.dispatchEvent(buildEvent('click', controller));
            assert.isFalse(clicked, 'Element click should not trigger event callback');
            assert.isFalse(keyPressed, 'Key should not have been pressed');
            assert.isNull(handler);
            assert.isNull(target);
        });
        doSkip('should unbind event listeners after catchAllViewEvents() (selector)', function () {
            var domNode = document.querySelector('#my-id'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            controller = new (IrLib.Controller.extend({
                view: domNode,
                handleEvent(event) {
                    target = event.target;
                    handler = this;
                    clicked = true;
                    keyPressed = true;
                }
            }));
            controller.catchAllViewEvents();

            controller.removeEventListeners();

            domNode.dispatchEvent(buildEvent('click', controller));
            assert.isFalse(clicked, 'Element click should not trigger event callback');
            assert.isFalse(keyPressed, 'Key should not have been pressed');
            assert.isNull(handler);
            assert.isNull(target);
        });
        it('should unbind event listeners catchAllViewEvents() (div)', function () {
            var domNode = document.createElement('div'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            controller = new (IrLib.Controller.extend({
                view: domNode,
                handleEvent(event) {
                    target = event.target;
                    handler = this;
                    clicked = true;
                    keyPressed = true;
                }
            }));

            controller.catchAllViewEvents();
            controller.removeEventListeners();

            domNode.dispatchEvent(buildEvent('click', controller));
            assert.isFalse(clicked, 'Element click should not trigger event callback');
            assert.isFalse(keyPressed, 'Key should not have been pressed');
            assert.isNull(handler);
            assert.isNull(target);
        });
    });
});
