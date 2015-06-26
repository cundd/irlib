/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('CoreObject', function () {
    var NewClass = IrLib.CoreObject.extend({
        'name': 'NewClass',
        getANumber: function () {
            return 2;
        },
        getAnimal: function () {
            return 'Elephant';
        },
        getName: function () {
            return this.name;
        }
    });
    var NewSubclass = NewClass.extend({
        'name': 'NewSubclass',
        getAnimal: function () {
            return 'Wolf';
        }
    });

    describe('new()', function () {
        it('should return an instance of the class', function () {
            assert.isTrue((new NewClass) instanceof NewClass);
        });
        it('should return a subclass of CoreObject', function () {
            assert.isTrue((new NewClass) instanceof IrLib.CoreObject);
            assert.isTrue((new NewSubclass) instanceof IrLib.CoreObject);
        });
        it('should inherit methods', function () {
            assert.strictEqual((new NewSubclass).getANumber(), 2);
        });
        it('should overwrite members', function () {
            assert.strictEqual((new NewSubclass).getName(), 'NewSubclass');
        });
        it('should overwrite methods', function () {
            assert.strictEqual((new NewSubclass).getAnimal(), 'Wolf');
        });
    });

    describe('guid()', function () {
        it('should not change', function () {
            var instance = new NewClass(),
                lastGuid;

            lastGuid = instance.guid();
            assert.strictEqual(instance.guid(), lastGuid);

            instance.aKey = 'A new value';

            assert.strictEqual(instance.guid(), lastGuid);
        });
        it('should return a unique value for each instance', function () {
            var guidCollection = [],
                i = 10000,
                noFail = 1,
                guid;

            while (--i > 0) {
                guid = (new NewClass).guid();
                noFail *= !(guid in guidCollection);
                guidCollection.push(guid);

                guid = (new NewSubclass).guid();
                noFail *= !(guid in guidCollection);
                guidCollection.push(guid);
            }
            assert.isTrue(!!noFail);
        });
    });

    describe('defineProperty()', function () {
        it('should add a new property', function () {
            var instance = new NewClass();

            instance.defineProperty('aKey', {
                value: 10
            });
            assert.strictEqual(instance.aKey, 10);
            assert.isTrue(instance.hasOwnProperty('aKey'));
            assert.isTrue('aKey' in instance);
        });
        it('should add a new property with getter', function () {
            var instance = new NewClass(), getterCalled = 0;

            instance.defineProperty('aKey', {
                get: function () {
                    return ++getterCalled;
                }
            });
            assert.strictEqual(instance.aKey, 1);
            assert.isTrue(instance.hasOwnProperty('aKey'));
            assert.isTrue('aKey' in instance);
            assert.strictEqual(getterCalled, 1);

            assert.strictEqual(instance.aKey, 2);
        });
        it('should add a new property with setter', function () {
            var instance = new NewClass(), setterCalled = 0;

            instance.defineProperty('aKey', {
                set: function (value) {
                    ++setterCalled;
                }
            });
            instance.aKey = 'whatever';
            assert.isTrue(instance.hasOwnProperty('aKey'));
            assert.isTrue('aKey' in instance);
            assert.strictEqual(setterCalled, 1);
        });
    });

    describe('defineProperties()', function () {
        it('should add new properties', function () {
            var instance = new NewClass();

            instance.defineProperties({
                'aKey': {
                    value: 10
                }
            });
            assert.strictEqual(instance.aKey, 10);
            assert.isTrue(instance.hasOwnProperty('aKey'));
            assert.isTrue('aKey' in instance);
        });
        it('should add new properties with getter', function () {
            var instance = new NewClass(), getterCalled = 0, anotherKeyGetterCalled = 0;

            instance.defineProperties({
                'aKey': {
                    get: function () {
                        return ++getterCalled;
                    }
                },
                'anotherKey': {
                    get: function () {
                        return ++anotherKeyGetterCalled;
                    }
                }
            });
            assert.strictEqual(instance.aKey, 1);
            assert.isTrue(instance.hasOwnProperty('aKey'));
            assert.isTrue('aKey' in instance);
            assert.strictEqual(getterCalled, 1);

            assert.strictEqual(instance.aKey, 2);


            assert.strictEqual(instance.anotherKey, 1);
            assert.isTrue(instance.hasOwnProperty('anotherKey'));
            assert.isTrue('anotherKey' in instance);
            assert.strictEqual(anotherKeyGetterCalled, 1);

            assert.strictEqual(instance.anotherKey, 2);
        });
        it('should add new properties with setter', function () {
            var instance = new NewClass(), setterCalled = 0, anotherKeySetterCalled = 0;

            instance.defineProperties({
                'aKey': {
                    set: function (value) {
                        ++setterCalled;
                    }
                },
                'anotherKey': {
                    set: function (value) {
                        ++anotherKeySetterCalled;
                    }
                }
            });
            instance.aKey = 'whatever';
            assert.isTrue(instance.hasOwnProperty('aKey'));
            assert.isTrue('aKey' in instance);
            assert.strictEqual(setterCalled, 1);

            instance.anotherKey = 'whatever';
            assert.isTrue(instance.hasOwnProperty('anotherKey'));
            assert.isTrue('anotherKey' in instance);
            assert.strictEqual(anotherKeySetterCalled, 1);
        });
    });
});
