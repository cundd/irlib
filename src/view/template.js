/**
 * Created by COD on 25.06.15.
 */

IrLib.View = IrLib.View || {};

IrLib.View.Template = IrLib.Interface.extend({
    /**
     * Template to render
     *
     * @type {String}
     */
    template: '',

    /**
     * Dictionary of template variables
     *
     * @type {IrLib.Dictionary}
     */
    variables: null,

    /**
     * Defines if a redraw is required
     *
     * @type {Boolean}
     */
    needsRedraw: true,

    init: function() {
        this.variables = new IrLib.Dictionary();
    },

    /**
     * Renders the template
     *
     * @return {String}
     */
    render: function () {
        var _template = this.template;

        _template = this.renderVariables(_template);
        _template = this.renderActions(_template);

        this.needsRedraw = false;
        return _template.replace(/\{\{[\w\.\-]+}}/g, '');
    },

    /**
    * Renders the variables inside the given template
    *
    * @param {String} template
    * @returns {String}
    */
    renderVariables: function(template) {
        var _variables = this.variables,
            propertyKey, propertyValue, replaceExpression
            ;

        for (propertyKey in _variables) {
            if (_variables.hasOwnProperty(propertyKey)) {
                propertyValue = _variables[propertyKey];
                replaceExpression = new RegExp('\\{\\{' + propertyKey + '\\}\\}', 'g');
                template = template.replace(replaceExpression, propertyValue);
            }
        }
        return template;
    },

    /**
    * Renders the actions inside the given template
    *
    * @param {String} template
    * @returns {String}
    */
    renderActions: function(template) {
        var actionRegularExpression = /\s\{\{action:([\w\-]*)}}\s/g,
            _document = $(document),
            matches = [], found, i, _this;

        /**
         * @type {Iresults.Modal}
         * @private
         */
        _this = this;

        while (found = actionRegularExpression.exec(template)) {
            matches.push({
                expression: found[0],
                action: found[1]
            });
            actionRegularExpression.lastIndex -= found[0].split(':')[1].length;
        }

        for (i = 0; i < matches.length; i++) {
            var elementId = Iresults.Modal.actionElementIds.length,
                actionDefinition = matches[i],
                actionName = actionDefinition.action,
                expression = actionDefinition.expression,
                elementIdString = 'ir-modal-' + elementId,
                elementIdAttribute = ' id="' + elementIdString + '" ',
                data
                ;
            Iresults.Modal.actionElementIds.push(elementId);

            data = {
                action: actionName
            };

            /* Prepare the template */
            template = template.replace(expression, elementIdAttribute);

            /* Register the click handler */
            _document.on('click', '#' + elementIdString, data, function(event) {
                var actionName = event.data.action,
                    imp = _this.controller.actions ? _this.controller.actions[actionName] : _this.controller[actionName];

                if (!imp) {
                    throw new Iresults.ActionError('No implementation for method "' + actionName + '"');
                }
                imp.call(_this.controller, event);
            });
        }

        return template;
    },

    /**
     * Set the variables
     *
     * @param {Object|IrLib.Dictionary} data
     */
    setVariables: function(data) {
        if (data instanceof IrLib.Dictionary) {
            this.variables = data;
        } else {
            this.variables = new IrLib.Dictionary(data);
        }
        this.needsRedraw = true;
    },

    /**
     * Add the variable with the given key and value
     *
     * @param {String} key
     * @param {*} value
     */
    assignVariable: function(key, value) {
        this.variables[key] = value;
        this.needsRedraw = true;
    },

    /**
     * Sets the template
     *
     * @param {String} template
     * @returns {IrLib.View.Template}
     */
    setTemplate: function (template) {
        this.template = template;
        this.needsRedraw = true;
        return this;
    }
});