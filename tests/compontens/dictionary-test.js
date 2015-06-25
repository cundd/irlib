/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('Dictionary', function () {
    describe('new()', function () {
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

    describe('keys()', function () {
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

    describe('values()', function () {
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
    });

    describe('map()', function () {
        it('should loop through each key value pair', function () {
            var dictionary = new IrLib.Dictionary({
                'firstName': 'Daniel',
                'lastName': 'Corn',
                'email': 'cod@iresults.li'
            });

            var result = dictionary.map(function(value, key, dictionaryArgument) {
                assert.strictEqual(dictionaryArgument, dictionary);
                return key + ' ' + value;
            });

            assert.typeOf(result, 'array');
            assert.strictEqual(result.length, 3);
            assert.strictEqual(result[0], 'firstName Daniel');
            assert.strictEqual(result[1], 'lastName Corn');
            assert.strictEqual(result[2], 'email cod@iresults.li');
        });
        it('should bind callback to thisArg argument', function () {
            var dictionary = new IrLib.Dictionary({
                'firstName': 'Daniel',
                'lastName': 'Corn',
                'email': 'cod@iresults.li'
            }),
                thisArg = {'name': 'a new object'};

            var result = dictionary.map(function(value, key, dictionaryArgument) {
                assert.strictEqual(dictionaryArgument, dictionary);
                assert.strictEqual(this, thisArg);
                return key + ' ' + value;
            }, thisArg);

            assert.typeOf(result, 'array');
            assert.strictEqual(result.length, 3);
            assert.strictEqual(result[0], 'firstName Daniel');
            assert.strictEqual(result[1], 'lastName Corn');
            assert.strictEqual(result[2], 'email cod@iresults.li');
        });
    });

    describe('forEach()', function () {
        it('should loop through each key value pair', function () {
            var dictionary = new IrLib.Dictionary({
                'firstName': 'Daniel',
                'lastName': 'Corn',
                'email': 'cod@iresults.li'
            }),
                invocationCounter = 0;

            var result = dictionary.forEach(function(value, key, dictionaryArgument) {
                assert.strictEqual(dictionaryArgument, dictionary);
                invocationCounter++;
            });

            assert.isUndefined(result);
            assert.strictEqual(invocationCounter, 3);
        });
        it('should bind callback to thisArg argument', function () {
            var dictionary = new IrLib.Dictionary({
                    'firstName': 'Daniel',
                    'lastName': 'Corn',
                    'email': 'cod@iresults.li'
                }),
                thisArg = {'name': 'a new object'},
                invocationCounter = 0;


            var result = dictionary.forEach(function(value, key, dictionaryArgument) {
                assert.strictEqual(dictionaryArgument, dictionary);
                assert.strictEqual(this, thisArg);
                invocationCounter++;
            }, thisArg);

            assert.isUndefined(result);
            assert.strictEqual(invocationCounter, 3);
        });
    });
});
