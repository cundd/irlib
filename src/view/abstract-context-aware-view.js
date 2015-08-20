/**
 * Created by COD on 25.06.15.
 */
require('view/interface');
require('view/abstract-variable-view');

/**
 * An abstract context-aware view
 *
 * @implements IrLib.View.ContextInterface
 * @abstract
 */
IrLib.View.AbstractContextAwareView = IrLib.View.AbstractVariableView.extend({
    /**
     * Views context
     *
     * @type {IrLib.View.Interface}
     */
    _context: null,

    init: function () {
        this._super();

        if (typeof this.context !== 'undefined') { // Check if a context is inherited
            this._context = this.context;
        }

        this.defineProperty(
            'context',
            {
                enumerable: true,
                get: this.getContext,
                set: this.setContext
            }
        );
    },

    /**
     * Returns the View's context
     *
     * @returns {IrLib.View.Interface}
     */
    getContext: function () {
        return this._context;
    },

    /**
     * Sets the View's context
     *
     * @param {IrLib.View.Interface} context
     * @returns {IrLib.View.Interface}
     */
    setContext: function (context) {
        this._context = context;
        return this;
    }
});
