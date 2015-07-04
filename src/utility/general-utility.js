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
     * @param {Object} object
     * @param {String} keyPath
     * @returns {*}
     */
    valueForKeyPathOfObject: function (object, keyPath) {
        if (typeof keyPath !== 'string') {
            throw new TypeError('Key path must be of type string', 1436018907);
        }
        var keyPathParts = keyPath.split('.'), currentKeyPathPart, currentValue, i,
            isIndex;
        currentValue = object;

        isIndex = function (value) {
            return !isNaN(parseInt(value)) && isFinite(value);
        };
        for (i = 0; i < keyPathParts.length; i++) {
            currentKeyPathPart = keyPathParts[i];
            if (typeof currentValue !== 'object') {
                throw new TypeError(
                    'Can not get key ' + currentKeyPathPart + ' of value of type ' + (typeof currentValue),
                    1436019551
                );
            }
            if (typeof currentValue[currentKeyPathPart] === 'undefined' && isIndex(currentValue)) {
                currentValue = currentValue[parseInt(currentKeyPathPart)];
            } else {
                currentValue = currentValue[currentKeyPathPart];
            }
        }
        return currentValue;
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