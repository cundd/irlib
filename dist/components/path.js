"use strict";
/**
 * Created by daniel on 25/03/16.
 */
var Path = (function () {
    /**
     *
     * @param path
     */
    function Path(path) {
        this.components = path.split('/');
    }
    /**
     *
     * @returns {string}
     */
    Path.prototype.toString = function () {
        return this.components.join('/');
    };
    return Path;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Path;
//# sourceMappingURL=path.js.map