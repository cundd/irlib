/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

describe('Path', function () {
    describe('new', function () {
        var testSets = {
            '/path/to/my/file': {
                'string': '/path/to/my/file',
                'isAbsolute': true
            },
            'path/to/my/file': {
                'string': 'path/to/my/file',
                'isAbsolute': false
            },
            '/path/to/my/file.json': {
                'string': '/path/to/my/file.json',
                'isAbsolute': true
            },
            'path/to/my/file.json': {
                'string': 'path/to/my/file.json',
                'isAbsolute': false
            }
        };

        var testPath = function (inputPath, testData) {
            var path = new IrLib.Path(inputPath),
                failureMessage = 'Failed test path "' + inputPath + '"',
                failureMessageMethod = failureMessage + ' and method ';

                assert.strictEqual(path.toString(), testData.string, failureMessageMethod + 'toString()');
                assert.strictEqual('' + path, testData.string, failureMessageMethod + 'toString()');
                assert.strictEqual(path.isAbsolute(), testData.isAbsolute, failureMessageMethod + 'isAbsolute()');
                assert.strictEqual(path.isRelative(), !testData.isAbsolute, failureMessageMethod + 'isRelative()');
        };

        it('should build path from string', function () {
            Object.keys(testSets).forEach(function (inputUrl) {
                testPath(inputUrl, testSets[inputUrl]);
            });
        });
    });
});
