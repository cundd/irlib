/**
 * Created by COD on 25.06.15.
 */
// 'view/interface');
// require('view/abstract-variable-view');
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An abstract context-aware view
 *
 * @implements IrLib.View.ContextInterface
 * @abstract
 */
var IrLib;
(function (IrLib) {
    var View;
    (function (View) {
        var AbstractContextAwareView = (function (_super) {
            __extends(AbstractContextAwareView, _super);
            // context?: ViewInterface;
            function AbstractContextAwareView() {
                _super.call(this);
                /**
                 * Views context
                 *
                 * @type {ViewInterface}
                 */
                this._context = null;
                if (typeof this.context !== 'undefined') {
                    this._context = this.context;
                }
                this.defineProperty('context', {
                    enumerable: true,
                    get: this.getContext,
                    set: this.setContext
                });
            }
            /**
             * Returns the View's context
             *
             * @returns {ViewInterface}
             */
            AbstractContextAwareView.prototype.getContext = function () {
                return this._context;
            };
            /**
             * Sets the View's context
             *
             * @param {ViewInterface} context
             * @returns {ViewInterface}
             */
            AbstractContextAwareView.prototype.setContext = function (context) {
                this._context = context;
                return this;
            };
            return AbstractContextAwareView;
        }(AbstractVariableView));
    })(View || (View = {}));
})(IrLib = exports.IrLib || (exports.IrLib = {}));
//# sourceMappingURL=abstract-context-aware-view.js.map