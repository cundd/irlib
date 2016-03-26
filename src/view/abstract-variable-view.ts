/**
 * Created by COD on 25.06.15.
 */
import IrLib from './../core-object';

/**
 * An abstract context-aware view
 *
 * @implements IrLib.View.VariableViewInterface
 * @abstract
 */
export namespace IrLib {
    namespace View {
        class AbstractVariableView extends CoreObject implements ViewInterface {
            /**
             * Dictionary of template variables
             *
             * @type {Dictionary}
             */
            protected _variables:Dictionary = null;
            
            
            protected _needsRedraw:boolean = true;

            constructor() {
                super();

                if (typeof this['variables'] === 'object') {
                    this.setVariables(this['variables']);
                } else {
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
            setVariables(data:Object) {
                if (typeof data !== 'object') {
                    throw new TypeError('Initialization argument has to be of type object, ' + (typeof data) + ' given');
                }
                if (data instanceof Dictionary) {
                    this._variables = data;
                } else {
                    this._variables = new Dictionary(data);
                }
                this._needsRedraw = true;
                return this;
            }

            /**
             * Adds the variable with the given key and value
             *
             * @param {string} key
             * @param {*} value
             * @returns {ViewInterface}
             */
            assignVariable(key, value) {
                this._variables[key] = value;
                this._needsRedraw = true;
                return this;
            }

            /**
             * Returns the currently assigned variables
             *
             * @returns {Dictionary}
             */
            getVariables() {
                return this._variables;
            }
        }
    }
}
