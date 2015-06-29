/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('Controller+View', function () {
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

    describe('view()', function () {
        it('should return the initialization parameter (IrLib.View.Template)', function () {
            var view = new IrLib.View.Template();

            var controller = new (IrLib.Controller.extend({
                view: view
            }));
            assert.strictEqual(controller.view, view);
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
        it('should set the view (IrLib.View.Template)', function () {
            var view = new IrLib.View.Template();
            var controller = new IrLib.Controller();
            controller.setView(view);
            assert.strictEqual(controller.view, view);
        });
        it('should throw for invalid parameters', function () {
            var controller = new IrLib.Controller();
            assert.throws(function () {
                controller.setView('something bad');
            });
        });
    });

    //describe('eventNames()', function () {
    //    it('should return all keys of the controllers "events" property', function () {
    //        var controller = new (IrLib.Controller.extend({
    //            events: {
    //                'click': function () {
    //                },
    //                'keydown': function () {
    //                }
    //            }
    //        }));
    //        assert.sameMembers(controller.eventNames(), ['click', 'keydown']);
    //    });
    //});

    if (TestRunner.name !== 'mocha-cli') {
        describe('initializeEventListeners()', function () {
            it('should bind event listeners (IrLib.View.Template)', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                controller = new (IrLib.Controller.extend({
                    view: view,
                    events: {
                        'click': function (event) {
                            target = event.irTarget;
                            handler = this;
                            clicked = true;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }
                    }
                }));
                controller.initializeEventListeners();

                view.dispatchEvent(buildEvent('click', controller));
                assert.isTrue(clicked);
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, view);
            });
            it('should handle bubbled events (IrLib.View.Template)', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    childNode = document.createElement('span'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    irTarget = null,
                    controller;

                view.render().appendChild(childNode);
                getFixturesDivToEnableBubbling().appendChild(view.render());


                controller = new (IrLib.Controller.extend({
                    view: view,
                    events: {
                        'click': function (event) {
                            target = event.target;
                            irTarget = event.irTarget;
                            handler = this;
                            clicked = true;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }
                    }
                }));
                controller.initializeEventListeners();

                childNode.dispatchEvent(buildEvent('click', controller));

                assert.strictEqual(view.render().firstChild, childNode);
                assert.isTrue(clicked, 'Child element was not clicked');
                assert.isFalse(keyPressed, 'A key has been pressed');
                assert.equal(handler, controller);
                assert.equal(target, childNode);
                assert.equal(irTarget, view);
            });
            it('should invoke event methods only once', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    clicked = 0,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                controller = new (IrLib.Controller.extend({
                    view: view,
                    events: {
                        'click': function (event) {
                            target = event.irTarget;
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

                view.dispatchEvent(buildEvent('click', controller));
                assert.equal(clicked, 1);
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, view);
            });
            it('should bind event listeners after setView() (IrLib.View.Template)', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                controller = new (IrLib.Controller.extend({
                    events: {
                        'click': function (event) {
                            target = event.irTarget;
                            handler = this;
                            clicked = true;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }
                    }
                }));

                controller.setView(view);
                controller.initializeEventListeners();

                view.dispatchEvent(buildEvent('click', controller));
                assert.isTrue(clicked);
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, view);
            });
            it('should handle bubbled events after setView() (IrLib.View.Template)', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    childNode = document.createElement('span'),
                    clicked = false,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    irTarget = null,
                    controller;

                view.render().appendChild(childNode);
                getFixturesDivToEnableBubbling().appendChild(view.render());


                controller = new (IrLib.Controller.extend({
                    events: {
                        'click': function (event) {
                            target = event.target;
                            irTarget = event.irTarget;
                            handler = this;
                            clicked = true;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }
                    }
                }));
                controller.setView(view);
                controller.initializeEventListeners();

                childNode.dispatchEvent(buildEvent('click', controller));

                assert.strictEqual(view.render().firstChild, childNode);
                assert.isTrue(clicked, 'Child element was not clicked');
                assert.isFalse(keyPressed, 'A key has been pressed');
                assert.equal(handler, controller);
                assert.equal(target, childNode);
                assert.equal(irTarget, view);
            });
            it('should invoke event methods only once after setView()', function () {
                var view = new IrLib.View.Template('<div></div>'),
                    clicked = 0,
                    keyPressed = false,
                    handler = null,
                    target = null,
                    controller;

                controller = new (IrLib.Controller.extend({
                    events: {
                        'click': function (event) {
                            target = event.irTarget;
                            handler = this;
                            clicked++;
                        },
                        'keydown': function () {
                            keyPressed = true;
                        }
                    }
                }));
                controller.setView(view);
                controller.initializeEventListeners();
                controller.initializeEventListeners();
                controller.initializeEventListeners();

                view.dispatchEvent(buildEvent('click', controller));
                assert.equal(clicked, 1);
                assert.isFalse(keyPressed);
                assert.equal(handler, controller);
                assert.equal(target, view);
            });
        });
    }

    //describe('removeEventListeners()', function () {
    //    it('should unbind event listeners (IrLib.View.Template)', function () {
    //        var view = document.createElement('div'),
    //            clicked = false,
    //            keyPressed = false,
    //            handler = null,
    //            target = null,
    //            controller;
    //
    //        controller = new (IrLib.Controller.extend({
    //            view: view,
    //            events: {
    //                'click': function (event) {
    //                    target = event.target;
    //                    handler = this;
    //                    clicked = true;
    //                },
    //                'keydown': function () {
    //                    keyPressed = true;
    //                }
    //            }
    //        }));
    //        controller.initializeEventListeners();
    //        controller.removeEventListeners();
    //
    //        view.dispatchEvent(buildEvent('click', controller));
    //        assert.isFalse(clicked);
    //        assert.isFalse(keyPressed);
    //        assert.isNull(handler);
    //        assert.isNull(target);
    //    });
    //    it('should unbind event listeners (selector)', function () {
    //        var view = document.querySelector('#my-id'),
    //            clicked = false,
    //            keyPressed = false,
    //            handler = null,
    //            target = null,
    //            controller;
    //
    //        controller = new (IrLib.Controller.extend({
    //            view: view,
    //            events: {
    //                'click': function (event) {
    //                    target = event.target;
    //                    handler = this;
    //                    clicked = true;
    //                },
    //                'keydown': function () {
    //                    keyPressed = true;
    //                }
    //
    //            }
    //        }));
    //        controller.initializeEventListeners();
    //        controller.removeEventListeners();
    //
    //        view.dispatchEvent(buildEvent('click', controller));
    //        assert.isFalse(clicked);
    //        assert.isFalse(keyPressed);
    //        assert.isNull(handler);
    //        assert.isNull(target);
    //    });
    //});
});
