/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('Controller', function () {
    bootstrapDocument();

    var buildEvent = function (eventName) {
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
            return event;
        },
        getFixturesDiv = function () {
            return document.getElementById('mocha-fixtures');
        };

    describe('#view', function () {
        it('should return the initialization parameter (div)', function () {
            var view = document.createElement('div');
            var controller = new IrLib.Controller(view);
            assert.strictEqual(controller.view, view);
        });
        //it('should return the initialization parameter (View object)', function(){
        //    var view = {};
        //    var controller = new IrLib.Controller(view);
        //    assert.strictEqual(controller.view, view);
        //});
        it('should return the initialization parameter (selector)', function () {
            var view = '#my-id';
            var controller = new IrLib.Controller(view);
            assert.strictEqual(controller.view, view);
        });

        it('should return the initialization parameter (div)', function () {
            var view = document.createElement('div');
            var controller = new (IrLib.Controller.extend({
                view: view
            }));
            assert.strictEqual(controller.view, view);
        });
        it('should return the initialization parameter (selector)', function () {
            var view = '#my-id';
            var controller = new (IrLib.Controller.extend({
                view: view
            }));
            assert.strictEqual(controller.view, view);
        });
        it('should throw for invalid initialization parameter (selector)', function () {
            assert.throws(function () {
                new (IrLib.Controller.extend({
                    view: 'something bad'
                }));
            });
        });
    });

    describe('#setView', function () {
        it('should set the view (div)', function () {
            var view = document.createElement('div');
            var controller = new IrLib.Controller();
            controller.setView(view);
            assert.strictEqual(controller.view, view);
        });
        it('should set the view (selector)', function () {
            var view = '#my-id';
            var controller = new IrLib.Controller();
            controller.setView(view);
            assert.strictEqual(controller.view, view);
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

    describe('#eventNames', function () {
        it('should return all keys of the controllers "events" property', function () {
            var controller = new (IrLib.Controller.extend({
                events: {
                    'click': function () {
                    },
                    'keydown': function () {
                    }
                }
            }));
            assert.sameMembers(controller.eventNames(), ['click', 'keydown']);
        });
    });

    if (TestRunner.name !== 'mocha-cli') {
        describe('#initializeEventListeners', function () {
            it('should bind event listeners (div)', function () {
                var domNode = document.createElement('div'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    events: {
                        'click': function (event) {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }
                    }
                }));
                controller.initializeEventListeners();

                domNode.dispatchEvent(buildEvent('click'));
                assert.isTrue(clicked);
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
                        'click': function (event) {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }

                    }
                }));
                controller.initializeEventListeners();

                domNode.dispatchEvent(buildEvent('click'));
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
                getFixturesDiv().appendChild(domNode)

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    events: {
                        'click': function (event) {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }
                    }
                }));
                controller.initializeEventListeners();

                childNode.dispatchEvent(buildEvent('click'));
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
                        'click': function (event) {
                            target = event.target;
                            handler = this;
                            clicked = true;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }

                    }
                }));
                controller.initializeEventListeners();

                childNode.dispatchEvent(buildEvent('click'));
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

                controller = new (IrLib.Controller.extend({
                    view: domNode,
                    events: {
                        'click': function (event) {
                            target = event.target;
                            handler = this;
                            clicked++;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }
                    }
                }));
                controller.initializeEventListeners();
                controller.initializeEventListeners();
                controller.initializeEventListeners();

                domNode.dispatchEvent(buildEvent('click'));
                assert.equal(clicked, 1);
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, domNode);
            });
        });
    }
    describe('#removeEventListeners', function () {
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
                    'click': function (event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown': function () {
                        keyPressed = true;
                    }
                }
            }));
            controller.initializeEventListeners();
            controller.removeEventListeners();

            domNode.dispatchEvent(buildEvent('click'));
            assert.isFalse(clicked);
            assert.isFalse(keyPressed);
            assert.isNull(handler);
            assert.isNull(target);
        });
        it('should unbind event listeners (selector)', function () {
            var domNode = document.querySelector('#my-id'),
                clicked = false,
                keyPressed = false,
                handler = null,
                target = null,
                controller;

            controller = new (IrLib.Controller.extend({
                view: domNode,
                events: {
                    'click': function (event) {
                        target = event.target;
                        handler = this;
                        clicked = true;
                    },
                    'keydown': function () {
                        keyPressed = true;
                    }

                }
            }));
            controller.initializeEventListeners();
            controller.removeEventListeners();

            domNode.dispatchEvent(buildEvent('click'));
            assert.isFalse(clicked);
            assert.isFalse(keyPressed);
            assert.isNull(handler);
            assert.isNull(target);
        });
    });
});
