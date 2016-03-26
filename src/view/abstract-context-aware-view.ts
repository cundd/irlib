/**
 * Created by COD on 25.06.15.
 */
// 'view/interface');
// require('view/abstract-variable-view');

/**
 * An abstract context-aware view
 *
 * @implements IrLib.View.ContextInterface
 * @abstract
 */
export namespace IrLib {
    namespace View {
        class AbstractContextAwareView extends AbstractVariableView {
            /**
             * Views context
             *
             * @type {ViewInterface}
             */
            _context:ViewInterface = null;

            // context?: ViewInterface;

            constructor() {
                super();

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
            }

            /**
             * Returns the View's context
             *
             * @returns {ViewInterface}
             */
            getContext() {
                return this._context;
            }

            /**
             * Sets the View's context
             *
             * @param {ViewInterface} context
             * @returns {ViewInterface}
             */
            setContext(context) {
                this._context = context;
                return this;
            }
        }
    }
}
