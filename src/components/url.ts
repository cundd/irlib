/**
 * Created by COD on 04.07.14.
 */
/**
 * Object representation of an URL
 *
 * @param {string} href
 * @constructor
 */


export namespace IrLib {
    class Url {
        private _protocol:String = '';
        private _host:String = '';
        private _hostname:String = '';
        private _port:String = '';
        private _hash:String = '';
        private _search:String = '';
        private _pathname:String = '';

        constructor(href) {
            if (arguments.length > 0) {
                var parser = document.createElement('a');
                parser.href = this._prepareDoubleStash('' + href);

                this._protocol = parser.protocol;   // => "http:"
                this._host = parser.host;           // => "example.com:3000"
                this._hostname = parser.hostname;   // => "example.com"
                this._port = parser.port;           // => "3000"
                this.setPathname(parser.pathname);  // => "/pathname/"
                this.setHash(parser.hash);          // => "#hash"
                this.setSearch(parser.search);      // => "?search=test"
            } else {
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
        static current() {
            if (typeof window === 'undefined') {
                throw new TypeError('window not defined in this context');
            }
            return new Url(window.location.href);
        };


        get protocol():String {
            return this._protocol;
        }

        set protocol(newValue:String) {
            this._protocol = newValue;
        }

        get host():String {
            return this._host;
        }

        set host(newValue:String) {
            this._host = newValue;
        }

        get hostname():String {
            return this._hostname;
        }

        set hostname(newValue:String) {
            this._hostname = newValue;
        }

        get port():String {
            return this._port;
        }

        set port(newValue:String) {
            this._port = newValue;
        }

        get hash():String {
            return this._hash;
        }

        set hash(newValue:String) {
            this._hash = newValue;
        }

        get search():String {
            return this._search;
        }

        set search(newValue:String) {
            this._search = newValue;
        }

        get pathname():String {
            return this._pathname;
        }

        set pathname(newValue:String) {
            this._pathname = newValue;
        }

        /**
         * Returns the host
         * @returns {string}
         */
        getHost() {
            return this._host;
        }

        /**
         * Sets the host
         * @returns {string}
         */
        setHost(newValue) {
            var hostDefinitionParts = newValue.split(':');
            this._host = newValue;
            this._hostname = hostDefinitionParts[0];
            this._port = hostDefinitionParts[1];
        }

        /**
         * Returns the hostname
         * @returns {string}
         */
        getHostname() {
            return this._hostname;
        }

        /**
         * Sets the hostname
         * @returns {string}
         */
        setHostname(newValue) {
            this._hostname = newValue;
            this._host = newValue + ':' + this._port;
        }

        /**
         * Returns the port
         * @returns {string}
         */
        getPort() {
            return this._port;
        }

        /**
         * Sets the port
         * @returns {string}
         */
        setPort(newValue) {
            this._port = newValue;
            this._host = this._hostname + ':' + newValue;
        }

        /**
         * Returns the protocol
         *
         * @returns {string}
         */
        getProtocol() {
            return this._protocol;
        }

        /**
         * Sets the protocol
         *
         * @param {string} newValue
         */
        setProtocol(newValue) {
            this._protocol = newValue;
        }

        /**
         * Returns the pathname
         *
         * @returns {string}
         */
        getPathname() {
            return this._pathname;
        }

        /**
         * Sets the pathname
         *
         * @param {string} newValue
         */
        setPathname(newValue) {
            newValue = '' + newValue;
            if (!newValue || newValue[0] !== '/') {
                newValue = '/' + newValue;
            }
            this._pathname = newValue;
        }

        /**
         * Returns the hash
         *
         * @returns {string}
         */
        getHash() {
            return this._hash;
        }

        /**
         * Sets the hash
         *
         * @param {string} newValue
         */
        setHash(newValue) {
            newValue = '' + newValue;
            if (newValue && newValue.charAt(0) !== '#') {
                newValue = '#' + newValue;
            }
            this._hash = newValue;
        }

        /**
         * Returns the search
         *
         * @returns {string}
         */
        getSearch() {
            return this._search;
        }

        /**
         * Sets the search
         *
         * @param {string} newValue
         */
        setSearch(newValue) {
            newValue = '' + newValue;
            if (newValue && newValue[0] !== '?') {
                newValue = '?' + newValue;
            }
            this._search = newValue;
        }

        /**
         * Returns if the URL is local
         *
         * @returns {boolean}
         */
        isLocal() {
            return window.location.host == this.host;
        }

        /**
         * Returns if the URL is equal to the current page
         *
         * @param {boolean} [ignoreSearch] If set to TRUE the URL's search/query part will not be compared
         * @returns {boolean}
         */
        isSamePage(ignoreSearch) {
            var pageUrl = Url.current();
            return (
                pageUrl.host == this.host &&
                pageUrl._protocol === this._protocol &&
                pageUrl.pathname === this.pathname &&
                (ignoreSearch || pageUrl.search === this.search)
            );
        }

        /**
         * Returns if the URL fully matches the current location
         *
         * @returns {boolean}
         */
        isCurrent() {
            return this.isEqualTo(Url.current());
        }

        /**
         * Returns if the URL is equal to the given URL
         *
         * @param {String|IrLib.Url} url
         * @returns {boolean}
         */
        isEqualTo(url) {
            return ("" + url) == ("" + this);
        }

        /**
         * Returns a string representation of the URL object
         *
         * @returns {string}
         */
        toString() {
            return (this._protocol ? this._protocol + '//' : '') +
                this.host +
                this.pathname +
                this.search +
                this._hash;
        }

        /**
         * Adds the protocol if the URI starts with //
         *
         * @param {string} input
         * @returns String}
         * @private
         */
        _prepareDoubleStash(input) {
            if (input.substr(0, 2) === '//') {
                if (typeof window !== 'undefined') {
                    return window.location.protocol + input;
                }
                return 'http:' + input;
            }
            return input;
        }
    }
}
