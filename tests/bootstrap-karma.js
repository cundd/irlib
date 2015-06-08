/**
 * Created by COD on 08.06.15.
 */
/* global createDomFixture */
var global = this;

var util = {
    isObject: function(arg) {
        return typeof arg === 'object' && arg !== null;
    },
    _extend: function(origin, add) {
        // Don't do anything if add isn't an object
        if (!add || !util.isObject(add)) return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    }
};

var require= function(module) {
    if (module === 'util') {
        return util;
    }

    var relativePath = module + '.js',
        request = new XMLHttpRequest(),
        src;


    if (module.indexOf('/') === -1) {
        relativePath = module + '/index.js';
    }

    src = 'base/node_modules/' + relativePath;
    request.open('GET', src, false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        return eval(request.responseText);
    }
    return {};
};

global.bootstrapDocument = function () {
    var mochaFixturesDiv = document.createElement('div');
    mochaFixturesDiv.id = 'mocha-fixtures';
    mochaFixturesDiv.appendChild(createDomFixture());
    document.getElementsByTagName('body')[0].appendChild(mochaFixturesDiv);
};

global.TestRunner.name = 'karma';