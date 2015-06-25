/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('Dictionary', function () {
    describe('new', function () {
        it('should add elements from given initialization argument', function () {
            var dictionary = new IrLib.Dictionary({
                'aKey': 'aValue',
                'aSecondKey': 'anotherValue'
            });
            assert.typeOf(dictionary.keys(), 'array');
            assert.strictEqual(dictionary.keys().length, 2);
        });
        it('should throw an exception for invalid initialization argument (string)', function () {
            assert.throws(function () {
                new IrLib.Dictionary('string');
            });
        });
        it('should throw an exception for invalid initialization argument (number)', function () {
            assert.throws(function () {
                new IrLib.Dictionary(1.0);
            });
        });
        it('should throw an exception for invalid initialization argument (function)', function () {
            assert.throws(function () {
                new IrLib.Dictionary(function () {
                });
            });
        });
    });

    describe('keys', function () {
        it('should return an empty array for empty dictionary', function () {
            var dictionary = new IrLib.Dictionary();
            assert.typeOf(dictionary.keys(), 'array');
            assert.strictEqual(dictionary.keys().length, 0);
        });
        it('should return a newly added key', function () {
            var dictionary = new IrLib.Dictionary();
            dictionary['aKey'] = 'aValue';
            assert.typeOf(dictionary.keys(), 'array');
            assert.strictEqual(dictionary.keys().length, 1);
            assert.strictEqual(dictionary.keys().indexOf('aKey'), 0);
        });
        it('should return overwritten keys only once', function () {
            var dictionary = new IrLib.Dictionary();
            dictionary['aKey'] = 'aValue';
            dictionary['aKey'] = 'anotherValue';
            assert.typeOf(dictionary.keys(), 'array');
            assert.strictEqual(dictionary.keys().length, 1);
            assert.strictEqual(dictionary.keys().indexOf('aKey'), 0);
        });
        it('should list functions', function () {
            var dictionary = new IrLib.Dictionary();
            dictionary['aFunction'] = function () {
            };
            assert.typeOf(dictionary.keys(), 'array');
            assert.strictEqual(dictionary.keys().length, 1);
            assert.strictEqual(dictionary.keys().indexOf('aFunction'), 0);
        });
    });

    describe('values', function () {
        it('should return an empty array for empty dictionary', function () {
            var dictionary = new IrLib.Dictionary();
            assert.typeOf(dictionary.values(), 'array');
            assert.strictEqual(dictionary.values().length, 0);
        });
        it('should return a newly added key', function () {
            var dictionary = new IrLib.Dictionary();
            dictionary['aKey'] = 'aValue';
            assert.typeOf(dictionary.values(), 'array');
            assert.strictEqual(dictionary.values().length, 1);
            assert.strictEqual(dictionary.values().indexOf('aValue'), 0);
        });
        it('should return overwritten keys only once', function () {
            var dictionary = new IrLib.Dictionary();
            dictionary['aKey'] = 'aValue';
            dictionary['aKey'] = 'anotherValue';
            assert.typeOf(dictionary.values(), 'array');
            assert.strictEqual(dictionary.values().length, 1);
            assert.strictEqual(dictionary.values().indexOf('anotherValue'), 0);
        });
        it('should list functions', function () {
            var dictionary = new IrLib.Dictionary();
            dictionary['aFunction'] = function () {
            };
            assert.typeOf(dictionary.values(), 'array');
            assert.strictEqual(dictionary.values().length, 1);
            assert.typeOf(dictionary.values()[0], 'function');
        });
        //it('should throw for invalid parameters', function () {
        //    var controller = new IrLib.Controller();
        //    assert.throws(function () {
        //        controller.setView('something bad');
        //    });
        //});
    });

});
