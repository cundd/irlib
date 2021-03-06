/**
 * Created by COD on 03.06.15.
 */

IrLib.Utility = IrLib.Utility || {};

var _GeneralUtility = IrLib.Utility.GeneralUtility = {
    /**
     * Returns if the given element is a HTML node
     *
     * @param {*} element
     * @returns {Boolean}
     */
    isDomNode: function (element) {
        return !!(element && element.nodeName);
    },

    /**
     * Returns the matching HTML node
     *
     * @param {*} element
     * @returns {HTMLElement}
     */
    domNode: function (element) {
        if (_GeneralUtility.isDomNode(element)) {
            return element;
        }
        if (typeof element === 'string') {
            return document.querySelector(element);
        }
        return null;
    },

    /**
     * Tries to transform the given value into an array
     *
     * If the value is
     * - undefined an empty array will be returned
     * - an array it will be cloned and returned (the elements will not be cloned)
     * - an object it's values will be returned
     * - something else a new array will be returned with the value as it's single element
     *
     * @param {*} value
     * @returns {*}
     */
    toArray: function (value) {
        if (typeof value === 'undefined') {
            return [];
        }
        if (Array.isArray(value)) {
            return value.slice();
        }
        if (typeof value === 'object') {
            var valueCollection = [],
                keys = Object.keys(value),
                keysLength = keys.length;
            for (var i = 0; i < keysLength; i++) {
                valueCollection.push(value[keys[i]]);
            }
            return valueCollection;
        }
        return [value];
    },

    /**
     * Returns the value for the key path of the given object
     *
     * @param {String} keyPath Collection of object keys concatenated with a dot (".")
     * @param {Object} object Root object to fetch the property
     * @param {Boolean} [graceful] Do not throw an exception for unresolved key paths
     * @returns {*}
     */
    valueForKeyPathOfObject: function (keyPath, object, graceful) {
        if (typeof keyPath !== 'string') {
            throw new TypeError('Key path must be of type string, ' + (typeof keyPath) + ' given');
        }
        var keyPathParts = keyPath.split('.'),
            keyPathPartsLength = keyPathParts.length,
            currentValue = object,
            currentKeyPathPart, i;

        for (i = 0; i < keyPathPartsLength; i++) {
            currentKeyPathPart = keyPathParts[i];
            if (typeof currentValue !== 'object') {
                if (!graceful) {
                    throw new TypeError(
                        'Can not get key ' + currentKeyPathPart + ' of value of type ' + (typeof currentValue)
                    );
                } else {
                    return undefined;
                }
            }
            currentValue = currentValue[currentKeyPathPart];
        }
        return currentValue;
    },

    /**
     * Sets the value for the key path of the given object
     *
     * @param {*} value New value to set
     * @param {String} keyPath Collection of object keys concatenated with a dot (".")
     * @param {Object} object Root object to set the property
     * @returns {*}
     */
    setValueForKeyPathOfObject: function (value, keyPath, object) {
        if (typeof keyPath !== 'string') {
            throw new TypeError('Key path must be of type string, ' + (typeof keyPath) + ' given');
        }
        var lastIndexOfDot = keyPath.lastIndexOf('.'), keyPathToParent, childKey, parentObject;

        // Only the first level child should be modified
        if (lastIndexOfDot === -1) {
            parentObject = object;
            childKey = keyPath;
        } else {
            keyPathToParent = keyPath.substr(0, lastIndexOfDot);
            childKey = keyPath.substr(lastIndexOfDot + 1);

            parentObject = _GeneralUtility.valueForKeyPathOfObject(keyPathToParent, object);
        }
        if (typeof parentObject !== 'object') {
            throw new TypeError(
                'Can not set key ' + keyPath + ' of value of type ' + (typeof parentObject)
            );
        }
        parentObject[childKey] = value;
    },

    /**
     * Returns if the given value is numeric
     *
     * @param {*} value
     * @returns {boolean}
     */
    isNumeric: function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    /**
     * Returns a deep copy of the given object
     *
     * @param {*}obj
     * @param {Number} depth
     * @returns {*}
     */
    clone: function (obj, depth) {
        var copy;
        if (arguments.length < 2) {
            depth = 10;
        }

        // Handle the 3 simple types, and null or undefined
        if (null === obj || "object" !== typeof obj) {
            return obj;
        }

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                if (depth - 1 > 0) {
                    copy[i] = _GeneralUtility.clone(obj[i], depth - 1);
                } else {
                    copy[i] = obj[i];
                }
            }
            return copy;
        }

        // Handle Object
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                if (depth - 1 > 0) {
                    copy[attr] = _GeneralUtility.clone(obj[attr], depth - 1);
                } else {
                    copy[attr] = obj[attr];
                }
            }
        }
        return copy;
    },

    /**
     * Adds the class to the given element
     *
     * @param {*} element HTML node or selector
     * @param {String} className
     */
    addClass: function (element, className) {
        element = _GeneralUtility.domNode(element);
        if (element) {
            if (element.classList) {
                element.classList.add(className);
            } else {
                element.className += ' ' + className;
            }
        }
    }
};
