/**
 * Class representing a file system path
 * @param {String} path
 * @constructor
 */
IrLib.Path = function (path) {
    this.absolute = false;
    if (!path) {
        this.components = [];
    }
    else {
        if (path.charAt(0) === '/') {
            this.absolute = true;
        }
        this.components = path.split('/').filter(function (item) {
            return !!item;
        });
    }
};

/**
 * Returns a string representation of the path
 *
 * @returns {string}
 */
IrLib.Path.prototype.toString = function () {
    return (this.absolute ? '/' : '') + this.components.join('/');
};

/**
 * Returns if the path is absolute
 *
 * @returns {boolean}
 */
IrLib.Path.prototype.isAbsolute = function () {
    return this.absolute;
};

/**
 * Returns if the path is relative
 *
 * @returns {boolean}
 */
IrLib.Path.prototype.isRelative = function () {
    return !this.absolute;
};