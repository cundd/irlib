/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;


var buildWebPackClass = function (exports) {
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    exports.default = function WebPackCreatedClass() {
        _classCallCheck(this, WebPackCreatedClass);
        this.name = 'WebPackCreatedClass';
        this.needs = ['classWithDependency'];
    };
};

describe('ServiceLocator', function () {
    var ef = function () {
        },
        NewClass = IrLib.CoreObject.extend({
            'name': 'NewClass'
        }),
        NewClassWithDependency = NewClass.extend({
            'needs': ['serviceLocator'],
            'name': 'NewClassWithDependency'
        }),
        NewClassWithNestedDependency = NewClass.extend({
            'needs': ['classWithDependency'],
            'name': 'NewClassWithNestedDependency'
        }),
        NewClassWithNestedDependencyWithRecursion = IrLib.CoreObject.extend({
            'needs': ['classWithDependencyThatWillProduceRecursion'],
            'name': 'NewClassWithNestedDependencyWithRecursion'
        }),
        NewClassWithDependencyThatWillProduceRecursion = IrLib.CoreObject.extend({
            'needs': ['classWithNestedDependencyWithRecursion'],
            'name': 'NewClassWithDependencyThatWillProduceRecursion'
        }),
        NewClassWithDependencyWithDifferentName = IrLib.CoreObject.extend({
            'needs': ['serviceLocator:sl'],
            'name': 'NewClassWithDependencyWithDifferentName'
        }),
        NewClassWithConstructorArgument = IrLib.CoreObject.extend({
            'name': 'NewClassWithConstructorArgument',
            'arg': null,
            'init': function (arg) {
                this.arg = arg;
            }
        }),
        NewClassStaticDependencyMethodWithNestedDependency = function () {
            this.name = 'NewClassStaticDependencyMethodWithNestedDependency';
        },
        NewClassWithStaticDependencyMethodWithDifferentName = function () {
            this.name = 'NewClassWithStaticDependencyMethodWithDifferentName';
        };


    NewClassStaticDependencyMethodWithNestedDependency.needs = function () {
        return ['classWithDependency'];
    };
    NewClassWithStaticDependencyMethodWithDifferentName.needs = function () {
        return ['serviceLocator:sl'];
    };

    describe('register()', function () {
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

    describe('registerMultiple()', function () {
        it('should fail for wrong factory type (string)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.registerMultiple({'serviceId': 'invalid'});
            });
        });
        it('should fail for wrong factory type (number)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.registerMultiple({'serviceId': 1});
            });
        });
        it('should fail for wrong factory type (array)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.registerMultiple({'serviceId': []});
            });
        });
        it('should fail for wrong factory type (object)', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.registerMultiple({'serviceId': {}});
            });
        });

        it('should accept subclasses of IrLib.CoreObject', function () {
            var sl = new IrLib.ServiceLocator();
            var AnotherNewClass = IrLib.CoreObject.extend({
                'name': 'AnotherNewClass'
            });
            sl.registerMultiple({myService: NewClass, anotherService: AnotherNewClass});
            assert.ok(sl.get('myService') instanceof NewClass);
            assert.ok(sl.get('anotherService') instanceof AnotherNewClass);
        });
    });

    describe('set()', function () {
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

    describe('get()', function () {
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
        it('should invoke didResolveDependencies', function () {
            var sl = new IrLib.ServiceLocator(),
                didResolveDependenciesWasCalled = false;
            sl.register('myService', NewClass.extend({
                didResolveDependencies: function () {
                    didResolveDependenciesWasCalled = true;
                }
            }));

            sl.create('myService');
            assert.ok(didResolveDependenciesWasCalled);
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
            sl.register('myFactoryMethodProvidedService', function () {
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
            sl.register('myInjectedInstance', function () {
                throw "Should not use factory";
            });
            assert.strictEqual(sl.get('myInjectedInstance'), instance);
        });
        it('should run factory only once', function () {
            var sl = new IrLib.ServiceLocator(),
                runCounter = 0, runs = 10;
            sl.register('factoryShouldBeOnlyCalledOnce', function () {
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

    describe('create()', function () {
        it('should return a new instance on subsequent calls', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClass);

            assert.ok(sl.create('myService') !== sl.create('myService'));
            assert.ok(sl.get('myService') !== sl.create('myService'));
        });
        it('should invoke didResolveDependencies', function () {
            var sl = new IrLib.ServiceLocator(),
                didResolveDependenciesWasCalled = false;
            sl.register('myService', NewClass.extend({
                didResolveDependencies: function () {
                    didResolveDependenciesWasCalled = true;
                }
            }));

            sl.create('myService');
            assert.ok(didResolveDependenciesWasCalled);
        });
        it('should fail for undefined service identifier', function () {
            var sl = new IrLib.ServiceLocator();
            assert.throws(function () {
                sl.create('undefinedService');
            });
        });
        it('should return new instance for constructor', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClass);
            var newService = sl.create('myService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClass');
            assert.ok(newService instanceof NewClass);
        });
        it('should return new instance for factory method', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myFactoryMethodProvidedService', function () {
                return new NewClass();
            });
            var newService = sl.create('myFactoryMethodProvidedService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClass');
            assert.ok(newService instanceof NewClass);
        });
        it('should not return set instance', function () {
            var sl = new IrLib.ServiceLocator(),
                instance = new NewClass();
            sl.register('myInjectedInstance', NewClass);
            sl.set('myInjectedInstance', instance);
            assert.ok(sl.create('myInjectedInstance') !== instance);
            assert.strictEqual(sl.get('myInjectedInstance'), instance);
        });
        it('should throw if not registered', function () {
            var sl = new IrLib.ServiceLocator(),
                instance = new NewClass();
            sl.set('myInjectedInstance', instance);
            assert.throws(function () {
                sl.create('myInjectedInstance')
            });
        });
        it('should accept one argument', function () {
            var sl = new IrLib.ServiceLocator(),
                instance;
            sl.register('myService', NewClassWithConstructorArgument);

            instance = sl.create('myService', 1209);
            assert.equal(instance.arg, 1209);
        });
        it('should throw if more than one argument', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClassWithConstructorArgument);

            assert.throws(function () {
                sl.create('myService', 1, 2)
            });
        });
    });

    describe('resolveDependencies()', function () {
        it('should resolve dependencies', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClassWithDependency);
            var newService = sl.get('myService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClassWithDependency');
            assert.ok(newService instanceof NewClass);
            assert.ok(newService instanceof NewClassWithDependency);
            assert.strictEqual(newService.serviceLocator, sl);
        });
        it('should resolve nested dependencies', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClassWithNestedDependency);
            sl.register('classWithDependency', NewClassWithDependency);
            var newService = sl.get('myService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClassWithNestedDependency');
            assert.ok(newService instanceof NewClass);
            assert.ok(newService instanceof NewClassWithNestedDependency);
            assert.isObject(newService.classWithDependency);
            assert.strictEqual(newService.classWithDependency.serviceLocator, sl);
        });
        it('should throw for infinite recursive dependencies', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('classWithNestedDependencyWithRecursion', NewClassWithNestedDependencyWithRecursion);
            sl.register('classWithDependencyThatWillProduceRecursion', NewClassWithDependencyThatWillProduceRecursion);
            assert.throws(function () {
                sl.get('classWithNestedDependencyWithRecursion');
            });
        });
        it('should resolve dependencies with different name', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClassWithDependencyWithDifferentName);
            var newService = sl.get('myService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClassWithDependencyWithDifferentName');
            assert.ok(newService instanceof NewClassWithDependencyWithDifferentName);
            assert.strictEqual(newService.sl, sl);
        });
        it('should resolve nested dependencies for WebPack create class', function () {
            var exp = {};
            buildWebPackClass(exp);
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', exp.default);
            sl.register('classWithDependency', NewClassWithDependency);
            var newService = sl.get('myService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'WebPackCreatedClass');
            assert.isObject(newService.classWithDependency);
            assert.strictEqual(newService.classWithDependency.serviceLocator, sl);
        });
        it('should resolve nested dependencies with static method', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClassStaticDependencyMethodWithNestedDependency);
            sl.register('classWithDependency', NewClassWithDependency);
            var newService = sl.get('myService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClassStaticDependencyMethodWithNestedDependency');
            assert.isObject(newService.classWithDependency);
            assert.strictEqual(newService.classWithDependency.serviceLocator, sl);
        });
        it('should resolve nested dependencies with static method with different name', function () {
            var sl = new IrLib.ServiceLocator();
            sl.register('myService', NewClassWithStaticDependencyMethodWithDifferentName);
            sl.register('classWithDependency', NewClassWithDependency);
            var newService = sl.get('myService');
            assert.isNotNull(newService);
            assert.equal(newService.name, 'NewClassWithStaticDependencyMethodWithDifferentName');
            assert.isObject(newService.sl);
            assert.strictEqual(newService.sl, sl);
        });
    });
});
