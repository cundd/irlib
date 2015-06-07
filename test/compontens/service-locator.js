/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
var assert = require('chai').assert;
var IrLib = require('../../dist/irlib.js');

describe('ServiceLocator', function () {
    var ef = function () {
    };

    var NewClass = IrLib.CoreObject.extend({
        'name': 'NewClass'
    });

    describe('#register', function () {
        it('should fail for wrong identifier type (number)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.register(1, ef);
            });
        });
        it('should fail for wrong identifier type (object)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.register({}, ef);
            });
        });
        it('should fail for wrong identifier type (array)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.register([], ef);
            });
        });
        it('should fail for wrong identifier type (function)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.register(ef, ef);
            });
        });
        it('should fail for wrong factory type (string)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.register('serviceId', 'invalid');
            });
        });
        it('should fail for wrong factory type (number)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.register('serviceId', 1);
            });
        });
        it('should fail for wrong factory type (array)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.register('serviceId', []);
            });
        });
        it('should fail for wrong factory type (object)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.register('serviceId', {});
            });
        });

        it('should accept subclasses of IrLib.CoreObject', function () {
            var sl = new IrLib.ServiceLocator();
            var NewClass = IrLib.CoreObject.extend({
                'name': 'NewClass'
            });
            sl.register('myService', NewClass);
        });
    });

    describe('#set', function () {
        it('should fail for wrong identifier type (number)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.set(1, ef);
            });
        });
        it('should fail for wrong identifier type (object)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.set({}, ef);
            });
        });
        it('should fail for wrong identifier type (array)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.set([], ef);
            });
        });
        it('should fail for wrong identifier type (function)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.set(ef, ef);
            });
        });
        it('should accept instance type (string)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.doesNotThrow(function () {
                sl.set('serviceId', 'invalid');
            });
        });
        it('should accept instance type (number)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.doesNotThrow(function () {
                sl.set('serviceId', 1);
            });
        });
        it('should accept instance type (array)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.doesNotThrow(function () {
                sl.set('serviceId', []);
            });
        });
        it('should accept instance type (object)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.doesNotThrow(function () {
                sl.set('serviceId', {});
            });
        });

        it('should accept subclasses of IrLib.CoreObject', function () {
            var sl = new IrLib.ServiceLocator();
            sl.set('aNewService', NewClass);
        });
    });

    describe('#get', function () {
        it('should return it self for identifier serviceLocator', function () {
            var sl = new IrLib.ServiceLocator();
            assert.strictEqual(sl.get('serviceLocator'), sl);
        });
        it('should fail for undefined service identifier', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.get('undefinedService');
            });
        });
        it('should return new instance for constructor', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClass);
            var newService = sl.get('myService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClass');
            assert.ok(newService instanceof NewClass);
        });
        it('should return new instance for factory method', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myFactoryMethodProvidedService', function() {
                return new NewClass();
            });
            var newService = sl.get('myFactoryMethodProvidedService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClass');
            assert.ok(newService instanceof NewClass);
        });
        it('should return set instance', function () {
            var sl = new IrLib.ServiceLocator(),
                instance = new NewClass();
            sl.set('myInjectedInstance', instance);
            assert.strictEqual(sl.get('myInjectedInstance'), instance);
        });
        it('should return set instance over factory', function () {
            var sl = new IrLib.ServiceLocator(),
                instance = new NewClass();
            sl.set('myInjectedInstance', instance);
            sl.register('myInjectedInstance', function() {
                throw "Should not use factory";
            });
            assert.strictEqual(sl.get('myInjectedInstance'), instance);
        });
        it('should run factory only once', function () {
            var sl = new IrLib.ServiceLocator(),
                runCounter = 0, runs = 10;
            sl.register('factoryShouldBeOnlyCalledOnce', function() {
                if (runCounter !== 0) {
                    throw "Should not call factory again" + runCounter;
                }
                runCounter++;
                return {};
            });
            while (--runs > 0) {
                sl.get('factoryShouldBeOnlyCalledOnce');
            }
        });
    });
});