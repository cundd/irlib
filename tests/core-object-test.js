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

    describe('new', function () {
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
});
