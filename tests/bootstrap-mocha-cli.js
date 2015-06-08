/**
 * Created by COD on 08.06.15.
 */
/* global createDomFixture */
global.chai = require('chai');
global.IrLib = require('../dist/irlib.js');
//var jsdom = global.jsdom = require('mocha-jsdom');
var jsdom = global.jsdom = require('jsdom');

global.bootstrapDocument = function () {
    var _document = global.document = jsdom.jsdom(
        '<html><body><div id="mocha-fixtures"></div></body></html>',
        {}
    );
    _document.getElementById('mocha-fixtures').appendChild(createDomFixture());
};
TestRunner.name = 'mocha-cli';
