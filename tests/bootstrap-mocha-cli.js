/**
 * Created by COD on 08.06.15.
 */
global.chai = require('chai');
global.IrLib = require('../dist/irlib.js');
var jsdom = global.jsdom = require('mocha-jsdom');

global.bootstrapDocument = function (html) {
    if (arguments.length == 0) {
        html = '<div class="outer">\n    <div class="my-class" id="my-id"></div>\n    <div id="my-id-inner"><a href="#">A link</a></div>\n</div>';
    }
    return jsdom({
        html:html
    });
};
global.TestRunner = 'mocha-cli';