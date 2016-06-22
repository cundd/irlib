/**
 * Created by COD on 25.06.15.
 */
require('view/interface');

/**
 * An abstract context-aware view
 *
 * @implements IrLib.View.VariableViewInterface
 * @abstract
 */
IrLib.View.AbstractVariableView = IrLib.View.Interface.extend({
    /**
     * Dictionary of template variables
     *
     * @type {IrLib.Dictionary}
     */
    _variables: null,

    /**
     * Dictionary of computed variables
     *
     * @type {IrLib.Dictionary}
     */
    _computed: null,

    init: function () {
        this._super();

        if (typeof this.variables === 'object') {
            this.setVariables(this.variables);
        } else {
            this.setVariables({});
        }

        if (typeof this.computed === 'object') { // Check if a computed variables are inherited
            this.setComputed(this.computed);
        }

        this.defineProperties({
            'variables': {
                enumerable: true,
                get: this.getVariables,
                set: this.setVariables
            },
            'computed': {
                enumerable: true,
                get: this.getComputed,
                set: this.setComputed
            }
        });
    },

    /**
     * @abstract
     */
    toString: function () {
        throw new IrLib.MissingImplementationError('assignVariable');
    },

    /**
     * Sets the variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @returns {IrLib.View.Interface}
     */
    setVariables: function (data) {
        if (typeof data !== 'object') {
            throw new TypeError('Initialization argument has to be of type object, ' + (typeof data) + ' given');
        }
        if (data instanceof IrLib.Dictionary) {
            this._variables = data;
        } else {
            this._variables = new IrLib.Dictionary(data);
        }
        this._needsRedraw = true;
        return this;
    },

    /**
     * Adds the variable with the given key and value
     *
     * @param {String} key
     * @param {*} value
     * @returns {IrLib.View.Interface}
     */
    assignVariable: function (key, value) {
        this._variables[key] = value;
        this._needsRedraw = true;
        return this;
    },

    /**
     * Returns the currently assigned variables
     *
     * @returns {IrLib.Dictionary}
     */
    getVariables: function () {
        return this._variables;
    },

    /**
     * Sets the registered computed variables
     *
     * @param {Object|IrLib.Dictionary} data
     * @returns {IrLib.View.Interface}
     */
    setComputed: function (data) {
        if (typeof data !== 'object') {
            throw new TypeError('Initialization argument has to be of type object, ' + (typeof data) + ' given');
        }
        if (data instanceof IrLib.Dictionary) {
            this._computed = data;
        } else {
            this._computed = new IrLib.Dictionary(data);
        }
        this._needsRedraw = true;
        return this;
    },

    /**
     * Returns the registered computed variables
     *
     * @returns {IrLib.Dictionary}
     */
    getComputed: function () {
        return this._computed;
    }
});
