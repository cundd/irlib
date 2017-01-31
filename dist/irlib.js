var IrLib =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by COD on 14.04.15.
 */
var IrError = function (_Error) {
    _inherits(IrError, _Error);

    function IrError(message, code) {
        var userInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        _classCallCheck(this, IrError);

        var _this = _possibleConstructorReturn(this, (IrError.__proto__ || Object.getPrototypeOf(IrError)).call(this, message, code || 1435238939));

        _this.userInfo = userInfo;
        return _this;
    }

    _createClass(IrError, [{
        key: 'toString',
        value: function toString() {
            return '[IrLib.Error] ' + (this.code ? '#' + this.code + ':' : '') + this.message;
        }
    }]);

    return IrError;
}(Error);

exports.default = IrError;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by COD on 03.06.15.
 */
var Config = {};

exports.default = Config;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by COD on 03.06.15.
 */
var CoreObject = function () {
    _createClass(CoreObject, null, [{
        key: 'createGuid',

        /**
         * Builds a new UID
         * @returns {string}
         */
        value: function createGuid() {
            return 'irLib-' + ++CoreObject.__lastGuid;
        }
    }]);

    function CoreObject() {
        _classCallCheck(this, CoreObject);

        this.__guid = CoreObject.createGuid();
        this.init();
    }

    _createClass(CoreObject, [{
        key: 'init',
        value: function init() {
            throw new Error('Init will not be called anymore');
        }

        /**
         * Returns the global unique ID of the object
         *
         * @returns {String}
         */

    }, {
        key: 'guid',
        value: function guid() {
            return this.__guid;
        }

        /**
         * Defines a new property with the given key and descriptor
         *
         * @param {String} key
         * @param {Object} descriptor
         * @returns {CoreObject}
         * @see Object.defineProperty()
         */

    }, {
        key: 'defineProperty',
        value: function defineProperty(key, descriptor) {
            if (descriptor.overwrite === false && this[key]) {
                return this;
            }
            Object.defineProperty(this, key, descriptor);
            return this;
        }

        /**
         * Defines new properties form the given properties
         *
         * @param {Object} properties
         * @returns {CoreObject}
         * @see Object.defineProperties()
         */

    }, {
        key: 'defineProperties',
        value: function defineProperties(properties) {
            Object.defineProperties(this, properties);
            return this;
        }

        /**
         * Returns a clone of this object
         *
         * @returns {CoreObject}
         */

    }, {
        key: 'clone',
        value: function clone() {
            var source = this;
            var _clone = new source.constructor();
            for (var attr in source) {
                if (source.hasOwnProperty(attr)) {
                    _clone[attr] = source[attr];
                }
            }
            _clone.__guid = IrLib.CoreObject.createGuid();

            return _clone;
        }

        /**
         * Creates a callback function with bound this
         *
         * @param {Function|String} method
         * @returns {Function}
         */

    }, {
        key: 'bind',
        value: function bind(method) {
            var _this = this;
            var impl = void 0;

            if (typeof method === 'function') {
                impl = method;
            } else if (typeof _this[method] === 'function') {
                impl = _this[method];
            } else {
                throw new IrLib.Error('Argument method must be either a method name or a function');
            }

            return function () {
                var __preparedArguments = Array.prototype.slice.call(arguments);
                __preparedArguments.push(this);
                return impl.apply(_this, __preparedArguments);
            };
        }
    }]);

    return CoreObject;
}();

/**
 * @type {number}
 * @private
 */


CoreObject.__lastGuid = 0;

exports.default = CoreObject;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by COD on 14.04.15.
 */
var MissingImplementationError = function (_Error) {
    _inherits(MissingImplementationError, _Error);

    function MissingImplementationError(message, code) {
        _classCallCheck(this, MissingImplementationError);

        return _possibleConstructorReturn(this, (MissingImplementationError.__proto__ || Object.getPrototypeOf(MissingImplementationError)).call(this, message, code || 1435238939));
    }

    _createClass(MissingImplementationError, [{
        key: 'toString',
        value: function toString() {
            return '[IrLib.MissingImplementationError] ' + (this.code ? '#' + this.code + ':' : '') + this.message;
        }
    }]);

    return MissingImplementationError;
}(Error);

exports.default = MissingImplementationError;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _error = __webpack_require__(0);

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by COD on 14.04.15.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var TypeError = function (_Error) {
    _inherits(TypeError, _Error);

    function TypeError() {
        _classCallCheck(this, TypeError);

        return _possibleConstructorReturn(this, (TypeError.__proto__ || Object.getPrototypeOf(TypeError)).apply(this, arguments));
    }

    _createClass(TypeError, [{
        key: 'toString',
        value: function toString() {
            return '[IrLib.TypeError] ' + (this.code ? '#' + this.code + ':' : '') + this.message;
        }
    }]);

    return TypeError;
}(_error2.default);

exports.default = TypeError;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = __webpack_require__(1);

Object.keys(_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _config[key];
    }
  });
});

var _coreObject = __webpack_require__(2);

Object.keys(_coreObject).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _coreObject[key];
    }
  });
});

var _error = __webpack_require__(0);

Object.keys(_error).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _error[key];
    }
  });
});

var _missingImplementationError = __webpack_require__(3);

Object.keys(_missingImplementationError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _missingImplementationError[key];
    }
  });
});

var _typeError = __webpack_require__(4);

Object.keys(_typeError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _typeError[key];
    }
  });
});

/***/ })
/******/ ]);