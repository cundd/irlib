/**
 * Created by COD on 04.07.14.
 */
/**
 * Object representation of an URL
 *
 * @param {string} href
 * @constructor
 */
"use strict";
var IrLib;
(function (IrLib) {
    var Url = (function () {
        function Url(href) {
            this._protocol = '';
            this._host = '';
            this._hostname = '';
            this._port = '';
            this._hash = '';
            this._search = '';
            this._pathname = '';
            if (arguments.length > 0) {
                var parser = document.createElement('a');
                parser.href = this._prepareDoubleStash('' + href);
                this._protocol = parser.protocol; // => "http:"
                this._host = parser.host; // => "example.com:3000"
                this._hostname = parser.hostname; // => "example.com"
                this._port = parser.port; // => "3000"
                this.setPathname(parser.pathname); // => "/pathname/"
                this.setHash(parser.hash); // => "#hash"
                this.setSearch(parser.search); // => "?search=test"
            }
            else {
                this._protocol = '';
                this._host = '';
                this._hostname = '';
                this._port = '';
                this._hash = '';
                this._search = '';
                this.setPathname('');
            }
        }
        /**
         * Returns the current browser URL
         *
         * @returns {IrLib.Url}
         */
        Url.current = function () {
            if (typeof window === 'undefined') {
                throw new TypeError('window not defined in this context');
            }
            return new Url(window.location.href);
        };
        ;
        Object.defineProperty(Url.prototype, "protocol", {
            get() {
                return this._protocol;
            },
            set(newValue) {
                this._protocol = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Url.prototype, "host", {
            get() {
                return this._host;
            },
            set(newValue) {
                this._host = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Url.prototype, "hostname", {
            get() {
                return this._hostname;
            },
            set(newValue) {
                this._hostname = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Url.prototype, "port", {
            get() {
                return this._port;
            },
            set(newValue) {
                this._port = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Url.prototype, "hash", {
            get() {
                return this._hash;
            },
            set(newValue) {
                this._hash = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Url.prototype, "search", {
            get() {
                return this._search;
            },
            set(newValue) {
                this._search = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Url.prototype, "pathname", {
            get() {
                return this._pathname;
            },
            set(newValue) {
                this._pathname = newValue;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the host
         * @returns {string}
         */
        Url.prototype.getHost = function () {
            return this._host;
        };
        /**
         * Sets the host
         * @returns {string}
         */
        Url.prototype.setHost = function (newValue) {
            var hostDefinitionParts = newValue.split(':');
            this._host = newValue;
            this._hostname = hostDefinitionParts[0];
            this._port = hostDefinitionParts[1];
        };
        /**
         * Returns the hostname
         * @returns {string}
         */
        Url.prototype.getHostname = function () {
            return this._hostname;
        };
        /**
         * Sets the hostname
         * @returns {string}
         */
        Url.prototype.setHostname = function (newValue) {
            this._hostname = newValue;
            this._host = newValue + ':' + this._port;
        };
        /**
         * Returns the port
         * @returns {string}
         */
        Url.prototype.getPort = function () {
            return this._port;
        };
        /**
         * Sets the port
         * @returns {string}
         */
        Url.prototype.setPort = function (newValue) {
            this._port = newValue;
            this._host = this._hostname + ':' + newValue;
        };
        /**
         * Returns the protocol
         *
         * @returns {string}
         */
        Url.prototype.getProtocol = function () {
            return this._protocol;
        };
        /**
         * Sets the protocol
         *
         * @param {string} newValue
         */
        Url.prototype.setProtocol = function (newValue) {
            this._protocol = newValue;
        };
        /**
         * Returns the pathname
         *
         * @returns {string}
         */
        Url.prototype.getPathname = function () {
            return this._pathname;
        };
        /**
         * Sets the pathname
         *
         * @param {string} newValue
         */
        Url.prototype.setPathname = function (newValue) {
            newValue = '' + newValue;
            if (!newValue || newValue[0] !== '/') {
                newValue = '/' + newValue;
            }
            this._pathname = newValue;
        };
        /**
         * Returns the hash
         *
         * @returns {string}
         */
        Url.prototype.getHash = function () {
            return this._hash;
        };
        /**
         * Sets the hash
         *
         * @param {string} newValue
         */
        Url.prototype.setHash = function (newValue) {
            newValue = '' + newValue;
            if (newValue && newValue.charAt(0) !== '#') {
                newValue = '#' + newValue;
            }
            this._hash = newValue;
        };
        /**
         * Returns the search
         *
         * @returns {string}
         */
        Url.prototype.getSearch = function () {
            return this._search;
        };
        /**
         * Sets the search
         *
         * @param {string} newValue
         */
        Url.prototype.setSearch = function (newValue) {
            newValue = '' + newValue;
            if (newValue && newValue[0] !== '?') {
                newValue = '?' + newValue;
            }
            this._search = newValue;
        };
        /**
         * Returns if the URL is local
         *
         * @returns {boolean}
         */
        Url.prototype.isLocal = function () {
            return window.location.host == this.host;
        };
        /**
         * Returns if the URL is equal to the current page
         *
         * @param {boolean} [ignoreSearch] If set to TRUE the URL's search/query part will not be compared
         * @returns {boolean}
         */
        Url.prototype.isSamePage = function (ignoreSearch) {
            var pageUrl = Url.current();
            return (pageUrl.host == this.host &&
                pageUrl._protocol === this._protocol &&
                pageUrl.pathname === this.pathname &&
                (ignoreSearch || pageUrl.search === this.search));
        };
        /**
         * Returns if the URL fully matches the current location
         *
         * @returns {boolean}
         */
        Url.prototype.isCurrent = function () {
            return this.isEqualTo(Url.current());
        };
        /**
         * Returns if the URL is equal to the given URL
         *
         * @param {String|IrLib.Url} url
         * @returns {boolean}
         */
        Url.prototype.isEqualTo = function (url) {
            return ("" + url) == ("" + this);
        };
        /**
         * Returns a string representation of the URL object
         *
         * @returns {string}
         */
        Url.prototype.toString = function () {
            return (this._protocol ? this._protocol + '//' : '') +
                this.host +
                this.pathname +
                this.search +
                this._hash;
        };
        /**
         * Adds the protocol if the URI starts with //
         *
         * @param {string} input
         * @returns String}
         * @private
         */
        Url.prototype._prepareDoubleStash = function (input) {
            if (input.substr(0, 2) === '//') {
                if (typeof window !== 'undefined') {
                    return window.location.protocol + input;
                }
                return 'http:' + input;
            }
            return input;
        };
        return Url;
    }());
})(IrLib = exports.IrLib || (exports.IrLib = {}));
//# sourceMappingURL=url.js.map