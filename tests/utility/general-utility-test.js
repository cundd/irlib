/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('Utility', function () {
    describe('GeneralUtility', function () {
        bootstrapDocument();

        describe('domNode()', function () {
            it('should return the dom node when passing a dom node', function () {
                var view = document.createElement('div');
                assert.strictEqual(IrLib.Utility.GeneralUtility.domNode(view), view);
            });
            it('should return a matching dom node when passing an ID string', function () {
                var node = IrLib.Utility.GeneralUtility.domNode('#my-id');
                assert.notEqual(node, null);
                assert.strictEqual(node.id, 'my-id')
            });
            it('should return a matching dom node when passing a class string', function () {
                var node = IrLib.Utility.GeneralUtility.domNode('.my-class');
                assert.notEqual(node, null);
                assert.strictEqual(node.id, 'my-id')
            });
        });

        describe('isDomNode()', function () {
            it('should return true if a dom node is given', function () {
                assert.isTrue(IrLib.Utility.GeneralUtility.isDomNode(document));
                assert.isTrue(IrLib.Utility.GeneralUtility.isDomNode(document.getElementById('my-id')));
            });
            it('should return false if no dom node is given', function () {
                assert.isFalse(IrLib.Utility.GeneralUtility.isDomNode());
                assert.isFalse(IrLib.Utility.GeneralUtility.isDomNode(""));
                assert.isFalse(IrLib.Utility.GeneralUtility.isDomNode('.my-class'));
                assert.isFalse(IrLib.Utility.GeneralUtility.isDomNode(document.getElementById('my-not-existing-id')));
            });
        });

        describe('toArray()', function () {
            it('should return an array for any value', function () {
                assert.typeOf(IrLib.Utility.GeneralUtility.toArray(document), 'array');
                assert.typeOf(IrLib.Utility.GeneralUtility.toArray([]), 'array');
                assert.typeOf(IrLib.Utility.GeneralUtility.toArray(), 'array');
                assert.typeOf(IrLib.Utility.GeneralUtility.toArray(undefined), 'array');
                assert.typeOf(IrLib.Utility.GeneralUtility.toArray(1.0), 'array');
                assert.typeOf(IrLib.Utility.GeneralUtility.toArray('aString'), 'array');
                assert.typeOf(IrLib.Utility.GeneralUtility.toArray({}), 'array');
                assert.typeOf(IrLib.Utility.GeneralUtility.toArray({'a': 1}), 'array');
            });
            it('should return an object\'s values', function () {
                var result = IrLib.Utility.GeneralUtility.toArray({'a': 1, 'b': 'string'});
                assert.typeOf(result, 'array');
                assert.strictEqual(result.length, 2);
                assert.strictEqual(result[0], 1);
                assert.strictEqual(result[1], 'string');
            });
            it('should clone an array', function () {
                var inputArray = ['a', 'b', 'c', 'd'];
                var result = IrLib.Utility.GeneralUtility.toArray(inputArray);
                assert.typeOf(result, 'array');
                assert.strictEqual(result.length, 4);
                assert.strictEqual(result[0], 'a');
                assert.strictEqual(result[3], 'd');

                inputArray.pop();
                assert.strictEqual(inputArray.length, 3);

                assert.strictEqual(result.length, 4);
                assert.strictEqual(result[0], 'a');
                assert.strictEqual(result[3], 'd');
            });
        });

        describe('valueForKeyPathOfObject()', function () {
            it('should return the value', function () {
                var testObject = {
                    'firstKey': 'my value',
                    'secondKey': {
                        'subValue': 'test value'
                    }
                };
                var _valueForKeyPathOfObject = IrLib.Utility.GeneralUtility.valueForKeyPathOfObject;
                assert.strictEqual(_valueForKeyPathOfObject(testObject, 'firstKey') , 'my value');
                assert.strictEqual(_valueForKeyPathOfObject(testObject, 'secondKey.subValue') , 'test value');
            });
            it('should resolve array index', function () {
                var testObject = {
                    'firstKey': [
                        'firstValue',
                        'secondValue',
                        'thirdValue'
                    ],
                    'secondKey': [
                        { 'value': 'wrong value'},
                        { 'value': 'wrong value'},
                        { 'value': 'correct value'}
                    ]
                };
                var _valueForKeyPathOfObject = IrLib.Utility.GeneralUtility.valueForKeyPathOfObject;
                assert.strictEqual(_valueForKeyPathOfObject(testObject, 'firstKey.1') , 'secondValue');
                assert.strictEqual(_valueForKeyPathOfObject(testObject, 'secondKey.2.value') , 'correct value');
            });
            it('should throw exception for invalid key path', function () {
                var _valueForKeyPathOfObject = IrLib.Utility.GeneralUtility.valueForKeyPathOfObject;
                assert.throws(function() {_valueForKeyPathOfObject({}, {})});
                assert.throws(function() {_valueForKeyPathOfObject({}, 1)});
                assert.throws(function() {_valueForKeyPathOfObject({}, null)});
            });
        });
    })
});