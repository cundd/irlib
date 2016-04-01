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
    /**
     * Adds the protocol if the URI starts with //
     *
     * @param {String} input
     * @returns String}
     * @private
     */
    this._prepareDoubleStash = function (input) {
        if (input.substr(0, 2) === '//') {
            if (typeof window !== 'undefined') {
                return window.location.protocol + input;
            }
            return 'http:' + input;
        }
        return input;
    };
    if (arguments.length > 0) {
        var parser = document.createElement('a'),
            location = typeof window !== 'undefined' ? window.location : {};
        parser.href = this._prepareDoubleStash('' + href);

        IrLib.Logger.log(parser.host);
        IrLib.Logger.log(parser.hostname);
        IrLib.Logger.log(parser.protocol);

        this._protocol = parser.protocol && parser.protocol !== ':' ? parser.protocol : location.protocol;   // => "http:"
        this._port = parser.port || location.port;           // => "3000"
        this._hostname = parser.hostname || location.hostname;   // => "example.com"
        this._host = parser.host || (this._port ? this._hostname + ':' + this._port : this._hostname);           // => "example.com:3000"
        this.setPathname(parser.pathname || location.pathname);  // => "/pathname/"
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

    Object.defineProperties(this, {
        'host': {
            get: this.getHost,
            set: this.setHost
        },
        'hostname': {
            get: this.getHostname,
            set: this.setHostname
        },
        'port': {
            get: this.getPort,
            set: this.setPort
        },
        'pathname': {
            get: this.getPathname,
            set: this.setPathname
        },
        'hash': {
            get: this.getHash,
            set: this.setHash
        },
        'protocol': {
            get: this.getProtocol,
            set: this.setProtocol
        },
        'search': {
            get: this.getSearch,
            set: this.setSearch
        }
    });
};

/**
 * Returns the current browser URL
 *
 * @returns {IrLib.Url}
 */
IrLib.Url.current = function () {
    if (typeof window === 'undefined') {
        throw new IrLib.TypeError('window not defined in this context');
    }
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
        newValue = '' + newValue;
        if (!newValue || newValue[0] !== '/') {
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
        newValue = '' + newValue;
        if (newValue && newValue.charAt(0) !== '#') {
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
        newValue = '' + newValue;
        if (newValue && newValue[0] !== '?') {
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
