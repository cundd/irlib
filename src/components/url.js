/**
 * Created by COD on 04.07.14.
 */
/**
 * Object representation of an URL
 *
 * @param {String} href
 * @constructor
 */
IrLib.Url = function (href) {
    if (arguments.length > 0) {
        if (href instanceof IrLib.Url) {
            href = href + '';
        }
        var parser = document.createElement('a');
        parser.href = href;

        this._protocol = parser.protocol; // => "http:"
        this._host = parser.host;     // => "example.com:3000"
        this._hostname = parser.hostname; // => "example.com"
        this._port = parser.port;     // => "3000"
        this.setPathname(parser.pathname); // => "/pathname/"
        this.setHash(parser.hash);     // => "#hash"
        this.setSearch(parser.search);   // => "?search=test"
    } else {
        this._protocol = '';
        this._host = '';
        this._hostname = '';
        this._port = '';
        this._pathname = '';
        this._hash = '';
        this._search = '';
    }

    Object.defineProperty(this, 'host', {
        get: this.getHost,
        set: this.setHost
    });
    Object.defineProperty(this, 'hostname', {
        get: this.getHostname,
        set: this.setHostname
    });
    Object.defineProperty(this, 'port', {
        get: this.getPort,
        set: this.setPort
    });
    Object.defineProperty(this, 'pathname', {
        get: this.getPathname,
        set: this.setPathname
    });
    Object.defineProperty(this, 'hash', {
        get: this.getHash,
        set: this.setHash
    });
    Object.defineProperty(this, 'protocol', {
        get: this.getProtocol,
        set: this.setProtocol
    });
    Object.defineProperty(this, 'search', {
        get: this.getSearch,
        set: this.setSearch
    });
};

/**
 * Returns the current browser URL
 *
 * @returns {IrLib.Url}
 */
IrLib.Url.current = function () {
    return new IrLib.Url(window.location.href);
};

IrLib.Url.prototype = {
    /**
     * Returns the host
     * @returns {String}
     */
    getHost: function () {
        return this._host;
    },

    /**
     * Sets the host
     * @returns {String}
     */
    setHost: function (newValue) {
        var hostDefinitionParts = newValue.split(':');
        this._host = newValue;
        this._hostname = hostDefinitionParts[0];
        this._port = hostDefinitionParts[1];
    },

    /**
     * Returns the hostname
     * @returns {String}
     */
    getHostname: function () {
        return this._hostname;
    },

    /**
     * Sets the hostname
     * @returns {String}
     */
    setHostname: function (newValue) {
        this._hostname = newValue;
        this._host = newValue + ':' + this._port;
    },

    /**
     * Returns the port
     * @returns {String}
     */
    getPort: function () {
        return this._port;
    },

    /**
     * Sets the port
     * @returns {String}
     */
    setPort: function (newValue) {
        this._port = newValue;
        this._host = this._hostname + ':' + newValue;
    },

    /**
     * Returns the protocol
     *
     * @returns {String}
     */
    getProtocol: function () {
        return this._protocol;
    },

    /**
     * Sets the protocol
     *
     * @param {String} newValue
     */
    setProtocol: function (newValue) {
        this._protocol = newValue;
    },

    /**
     * Returns the pathname
     *
     * @returns {String}
     */
    getPathname: function () {
        return this._pathname;
    },

    /**
     * Sets the pathname
     *
     * @param {String} newValue
     */
    setPathname: function (newValue) {
        if (newValue[0] !== '/') {
            newValue = '/' + newValue;
        }
        this._pathname = newValue;
    },

    /**
     * Returns the hash
     *
     * @returns {String}
     */
    getHash: function () {
        return this._hash;
    },

    /**
     * Sets the hash
     *
     * @param {String} newValue
     */
    setHash: function (newValue) {
        if (newValue.charAt(0) !== '#') {
            newValue = '#' + newValue;
        }
        this._hash = newValue;
    },

    /**
     * Returns the search
     *
     * @returns {String}
     */
    getSearch: function () {
        return this._search;
    },

    /**
     * Sets the search
     *
     * @param {String} newValue
     */
    setSearch: function (newValue) {
        if (newValue[0] !== '?') {
            newValue = '?' + newValue;
        }
        this._search = newValue;
    },

    /**
     * Returns if the URL is local
     *
     * @returns {boolean}
     */
    isLocal: function () {
        return window.location.host == this.host;
    },

    /**
     * Returns if the URL is equal to the current page
     *
     * @param {boolean} [ignoreSearch] If set to TRUE the URL's search/query part will not be compared
     * @returns {boolean}
     */
    isSamePage: function (ignoreSearch) {
        var pageUrl = IrLib.Url.current();
        return (
        pageUrl.host == this.host &&
        pageUrl._protocol === this._protocol &&
        pageUrl.pathname === this.pathname &&
        (ignoreSearch || pageUrl.search === this.search)
        );
    },

    /**
     * Returns if the URL fully matches the current location
     *
     * @returns {boolean}
     */
    isCurrent: function () {
        return this.isEqualTo(IrLib.Url.current());
    },

    /**
     * Returns if the URL is equal to the given URL
     *
     * @param {String|IrLib.Url} url
     * @returns {boolean}
     */
    isEqualTo: function (url) {
        return ("" + url) == ("" + this);
    },

    /**
     * Returns a string representation of the URL object
     *
     * @returns {string}
     */
    toString: function () {
        return (this._protocol ? this._protocol + '//' : '') +
            this.host +
            this.pathname +
            this.search +
            this._hash;
    }
};
