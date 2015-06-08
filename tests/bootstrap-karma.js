/**
 * Created by COD on 08.06.15.
 */
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
    console.log(module);

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
        //console.log(request.responseText);
        return eval(request.responseText);
    } else {
        console.log(request.status)
    }
};

global.bootstrapDocument = function (html) {
    document.getElementsByTagName('body')[0].appendChild(createDomFixture());
};

global.TestRunner = 'karma';