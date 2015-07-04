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
     * @param {String} keyPath
     * @param {Object} object
     * @returns {*}
     */
    valueForKeyPathOfObject: function (keyPath, object) {
        if (typeof keyPath !== 'string') {
            throw new TypeError('Key path must be of type string, ' + (typeof keyPath) + ' given', 1436018907);
        }
        var keyPathParts = keyPath.split('.'),
            currentValue = object,
            currentKeyPathPart, i;

        for (i = 0; i < keyPathParts.length; i++) {
            currentKeyPathPart = keyPathParts[i];
            if (typeof currentValue !== 'object') {
                throw new TypeError(
                    'Can not get key ' + currentKeyPathPart + ' of value of type ' + (typeof currentValue),
                    1436019551
                );
            }
            if (typeof currentValue[currentKeyPathPart] === 'undefined' && _GeneralUtility._toArrayIndex(currentKeyPathPart)) {
                currentValue = currentValue[parseInt(currentKeyPathPart)];
            } else {
                currentValue = currentValue[currentKeyPathPart];
            }
        }
        return currentValue;
    },

    /**
     * Sets the value for the key path of the given object
     *
     * @param {*} value
     * @param {String} keyPath
     * @param {Object} object
     * @returns {*}
     */
    setValueForKeyPathOfObject: function (value, keyPath, object) {
        if (typeof keyPath !== 'string') {
            throw new TypeError('Key path must be of type string, ' + (typeof keyPath) + ' given', 1436018907);
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
                'Can not set key ' + keyPath + ' of value of type ' + (typeof parentObject),
                1436019552
            );
        }
        if (Array.isArray(parentObject) && _GeneralUtility._toArrayIndex(childKey)) {
            parentObject[_GeneralUtility._toArrayIndex(childKey)] = value;
        } else {
            parentObject[childKey] = value;
        }
    },

    /**
     * Returns if the integer representation of the given value or -1 if it could not be transformed
     *
     * @param {*} value
     * @returns {number}
     * @private
     */
    _toArrayIndex: function (value) {
        if(!isNaN(parseInt(value)) && isFinite(value)) {
            return parseInt(value);
        }
        return -1;
    },

    /**
     * Returns if the given value is numeric
     *
     * @param {*} value
     * @returns {boolean}
     */
    isNumeric: function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

};