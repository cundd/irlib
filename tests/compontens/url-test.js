/**
 * Created by COD on 03.06.15.
 */
/*global describe, it */
'use strict';
var assert = chai.assert;

//
// Regular Expression for URL validation
//
// Author: Diego Perini
// Updated: 2010/12/05
// License: MIT
//
// Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// the regular expression composed & commented
// could be easily tweaked for RFC compliance,
// it was expressly modified to fit & satisfy
// these test for an URL shortener:
//
//   http://mathiasbynens.be/demo/url-regex
//
// Notes on possible differences from a standard/generic validation:
//
// - utf-8 char class take in consideration the full Unicode range
// - TLDs have been made mandatory so single names like "localhost" fails
// - protocols have been restricted to ftp, http and https only as requested
//
// Changes:
//
// - IP address dotted notation validation, range: 1.0.0.0 - 223.255.255.255
//   first and last IP address of each class is considered invalid
//   (since they are broadcast/network addresses)
//
// - Added exclusion of private, reserved and/or local networks ranges
//
// - Made starting path slash optional (http://example.com?foo=bar)
//
// - Allow a dot (.) at the end of hostnames (http://example.com.)
//
// Compressed one-line versions:
//
// Javascript version
//
// /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
//
// PHP version
//
// _^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]-*)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]-*)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$_iuS
//
var re_weburl = new RegExp(
    "^" +
    // protocol identifier
    "(?:(?:https?|ftp|file)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address exclusion
    // private & local networks
// allow 127.0.0.1       "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host name
    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
    // domain name
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
    // TLD identifier
    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    // TLD may end with dot
    "\\.?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]\\S*)?" +
    "$", "i"
);

var windowIsDefined = function () {
    return typeof window !== 'undefined';
};

var isValidUrl = function (url) {
    return !windowIsDefined() || re_weburl.test('' + url);
};

var isMochaCli = function () {
    return TestRunner.name === 'mocha-cli';
};


describe('Url', function () {
    describe('new', function () {
        var testSets = {
            '/': {
                'pathname': '/',
                'hash': '',
                'search': '',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '/subPath': {
                'pathname': '/subPath',
                'hash': '',
                'search': '',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '/subPath/next-level': {
                'pathname': '/subPath/next-level',
                'hash': '',
                'search': '',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '/subPath/next-level?search=1&param2=xyz#hash': {
                'pathname': '/subPath/next-level',
                'hash': '#hash',
                'search': '?search=1&param2=xyz',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '/subPath/?search=1&param2=xyz#hash': {
                'pathname': '/subPath/',
                'hash': '#hash',
                'search': '?search=1&param2=xyz',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '/subPath/next-level?search=1&param2=xyz': {
                'pathname': '/subPath/next-level',
                'hash': '',
                'search': '?search=1&param2=xyz',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '/subPath/?search=1&param2=xyz': {
                'pathname': '/subPath/',
                'hash': '',
                'search': '?search=1&param2=xyz',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '/?search=1&param2=xyz#hash': {
                'pathname': '/',
                'hash': '#hash',
                'search': '?search=1&param2=xyz',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '?search=1&param2=xyz#hash': {
                'pathname': windowIsDefined() ? window.location.pathname : '/',
                'hash': '#hash',
                'search': '?search=1&param2=xyz',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            'www.cundd.net?search=1&param2=xyz#hash': {
                'skipForMochaCli': true,
                'pathname': '/tests/www.cundd.net',
                'hash': '#hash',
                'search': '?search=1&param2=xyz',
                'hostname': windowIsDefined() ? window.location.hostname : '',
                'protocol': windowIsDefined() ? window.location.protocol : 'file:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            'http://www.cundd.net?search=1&param2=xyz#hash': {
                'pathname': '/',
                'hash': '#hash',
                'search': '?search=1&param2=xyz',
                'hostname': 'www.cundd.net',
                'protocol': windowIsDefined() ? window.location.protocol : 'http:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            'https://www.cundd.net?search=1&param2=xyz#hash': {
                'pathname': '/',
                'hash': '#hash',
                'search': '?search=1&param2=xyz',
                'hostname': 'www.cundd.net',
                'protocol': 'https:',
                'port': windowIsDefined() ? window.location.port : '80'
            },
            '//www.cundd.net?search=1&param2=xyz#hash': {
                'pathname': '/',
                'hash': '#hash',
                'search': '?search=1&param2=xyz',
                'hostname': 'www.cundd.net',
                'protocol': windowIsDefined() ? window.location.protocol : 'http:',
                'port': windowIsDefined() ? window.location.port : '80'
            }
        };

        var testUrl = function (inputUrl, testData) {
            var url = new IrLib.Url(inputUrl),
                failureMessage = 'Failed test for URL "' + inputUrl + '"',
                failureMessageProperty = failureMessage + ' and property ';

            if (false === (testData.skipForMochaCli && isMochaCli())) {
                assert.isTrue(isValidUrl(url), failureMessage);
                assert.strictEqual(url.pathname, testData.pathname, failureMessageProperty + 'pathname');
                assert.strictEqual(url.protocol, testData.protocol, failureMessageProperty + 'protocol');
                assert.strictEqual(url.hash, isMochaCli() ? '' : testData.hash, failureMessageProperty + 'hash');
                assert.strictEqual(url.search, testData.search, failureMessageProperty + 'search');
                assert.strictEqual(url.hostname, testData.hostname, failureMessageProperty + 'hostname');
            }
        };

        it('should build full URL from string', function () {
            Object.keys(testSets).forEach(function (inputUrl) {
                testUrl(inputUrl, testSets[inputUrl]);
            });
        });

        it('should build full URL from URL', function () {
            Object.keys(testSets).forEach(function (inputUrl) {
                testUrl(new IrLib.Url(inputUrl), testSets[inputUrl]);
            });
        });
    });

    describe('current', function () {
        if (TestRunner.name === 'mocha-cli') {
            it('should throw if window is not defined', function () {
                assert.throws(function () {
                    IrLib.Url.current();
                });
            });
        } else {
            it('should create from the current URL', function () {
                var url = IrLib.Url.current();

                assert.isTrue(isValidUrl(url));
                assert.strictEqual(url.pathname, '/tests/runner.html');
                assert.strictEqual(url.protocol, window.location.protocol);
                assert.strictEqual(url.hash, window.location.hash);
                assert.strictEqual(url.search, window.location.search);
                assert.strictEqual(url.hostname, window.location.hostname);
            });
        }
    });
});
