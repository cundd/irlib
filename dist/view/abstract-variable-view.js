"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An abstract context-aware view
 *
 * @implements IrLib.View.VariableViewInterface
 * @abstract
 */
var IrLib;
(function (IrLib) {
    var View;
    (function (View) {
        var AbstractVariableView = (function (_super) {
            __extends(AbstractVariableView, _super);
            function AbstractVariableView() {
                _super.call(this);
                /**
                 * Dictionary of template variables
                 *
                 * @type {Dictionary}
                 */
                this._variables = null;
                this._needsRedraw = true;
                if (typeof this['variables'] === 'object') {
                    this.setVariables(this['variables']);
                }
                else {
                    this.setVariables({});
                }
                this.defineProperties({
                    'variables': {
                        enumerable: true,
                        get: this.getVariables,
                        set: this.setVariables
                    }
                });
            }
            /**
             * Sets the variables
             *
             * @param {Object|Dictionary} data
             * @returns {ViewInterface}
             */
            AbstractVariableView.prototype.setVariables = function (data) {
                if (typeof data !== 'object') {
                    throw new TypeError('Initialization argument has to be of type object, ' + (typeof data) + ' given');
                }
                if (data instanceof Dictionary) {
                    this._variables = data;
                }
                else {
                    this._variables = new Dictionary(data);
                }
                this._needsRedraw = true;
                return this;
            };
            /**
             * Adds the variable with the given key and value
             *
             * @param {string} key
             * @param {*} value
             * @returns {ViewInterface}
             */
            AbstractVariableView.prototype.assignVariable = function (key, value) {
                this._variables[key] = value;
                this._needsRedraw = true;
                return this;
            };
            /**
             * Returns the currently assigned variables
             *
             * @returns {Dictionary}
             */
            AbstractVariableView.prototype.getVariables = function () {
                return this._variables;
            };
            return AbstractVariableView;
        }(CoreObject));
    })(View || (View = {}));
})(IrLib = exports.IrLib || (exports.IrLib = {}));
//# sourceMappingURL=abstract-variable-view.js.map