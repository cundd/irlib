/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 *
 * Edited by Daniel Corn
 */
// jshint ignore: start
// Inspired by base2 and Prototype
(function(root){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    //var hasUnderscoreJs = root['_'] && root._['clone'];
    //var hasJQuery = root['jQuery'] && root.jQuery().jquery;
    //
    //var simpleClone = function(source, isDeep) {
    //    var target = {};
    //    for (var prop in source) {
    //        if (!source.hasOwnProperty(prop)) {
    //            console.log('skip: ' + prop)
    //            continue;
    //        }
    //        if (source[prop] instanceof Date) {
    //            console.log('copy: Date ' + prop);
    //            target[prop] = source[prop];
    //
    //            continue;
    //
    //        }
    //        if (isDeep && typeof source[prop] === 'object') {
    //            target[prop] = simpleClone(target[prop], source[prop]);
    //        } else {
    //            target[prop] = source[prop];
    //        }
    //    }
    //    return target;
    //};
    //var createLocalProperty = function(source) {
    //    if (!source) {
    //        return source;
    //    }
    //    if (typeof source === 'object') {
    //        console.log('is object');
    //        if (hasJQuery) {
    //            return jQuery.extend({}, source);
    //        }
    //        if (hasUnderscoreJs) {
    //            return _.clone(source)
    //        }
    //        return simpleClone(source, false);
    //    }
    //    return source;
    //};

    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            //if (typeof prop[name] === 'object') {
            //    IrLib.Logger.warn(
            //        'Detected object type prototype member "' + name + '". ' +
            //        'You should initialize member objects inside init()'
            //    );
            //}
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
                //createLocalProperty(prop[name]);
                //(typeof prop[name] === 'object' ? simpleClone(prop[name]) : prop[name]);
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})(this);