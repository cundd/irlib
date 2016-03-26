/**
 * Created by COD on 25.06.15.
 */
// require('view/template');

export namespace IrLib.View {
    /**
     * A loop based view
     */
    class LoopView extends AbstractDomView implements EventListener, ViewInterface, ContextInterface, SubViewInterface {
        needs: ['serviceLocator'];

        /**
         * @type {ServiceLocator}
         */
        serviceLocator:ServiceLocator = null;

        /**
         * Content to loop over
         *
         * @type {Array}
         */
        _content:Array = null;

        /**
         * Template to repeat
         *
         * @type {ViewInterface}
         */
        _templateView:ViewInterface= null;

        /**
         * Original template input
         *
         * @type {string}
         */
        _originalTemplate:string = '';

        /**
         * Key to use to access the current iteration value
         *
         * @type {string}
         */
        _asKey:string = 'this';

        constructor(template, content, asKey) {
            this._super();
            if (template) { // Check if the template argument is given
                this.setTemplate(template);
            } else if (typeof this.template === 'string') { // Check if a template string is inherited
                this.setTemplate(this.template.slice(0));
            }

            if (content) { // Check if the content is given
                this.setContent(content);
            } else if (this.content) { // Check if a content is inherited
                this.setContent(this.content);
            }

            if (asKey) { // Check if the as-key is given
                this._asKey = asKey;
            } else if (typeof this.asKey === 'string') { // Check if the as-key is inherited
                this.setAsKey(this.asKey);
            }

            if (typeof this.context !== 'undefined') { // Check if a context is inherited
                this._context = this.context;
            }

            this.defineProperties({
                'content': {
                    enumerable: true,
                    get: this.getContent,
                    set: this.setContent
                },
                'asKey': {
                    enumerable: true,
                    get: this.getAsKey,
                    set: this.setAsKey
                },
                'needsRedraw': {
                    enumerable: true,
                    get: this.getNeedsRedraw
                },
                'template': {
                    enumerable: true,
                    get: this.getTemplateView,
                    set: this.setTemplate
                }
            });
        }

        /**
         * Renders the template
         *
         * @return {Node|HTMLElement}
         */
        render() {
            if (this._needsRedraw) {
                delete this._dom;

                //this._dom = this._createDom(this.toString());

                var domNode = this._createDom();
                this._render(domNode);
                this._dom = domNode;

                this._needsRedraw = false;
            }
            return this._dom;
        }

        /**
         * Returns the string representation of the rendered template
         *
         * @returns {string}
         */
        toString() {
            return this._render();
        }

        /**
         * Loop over to content, render the template and append to the node (if given)
         *
         * @param {Node|HTMLElement} [appendToNode]
         * @returns {string}
         * @private
         */
        _render(appendToNode) {
            var content = this._content;
            if (content === null) {
                throw new ReferenceError('No content defined');
            }

            var contentLength = content.length,
                _template = this.getTemplateView(),
                _asKey = this.getAsKey(),
                renderedContent = '',
                templateCopy, currentVariables, scope, i;

            if (!_template) {
                throw new ReferenceError('Template not specified');
            }

            _template.setContext(this);
            for (i = 0; i < contentLength; i++) {
                //templateCopy = IrLib.Utility.GeneralUtility.clone(_template, 12);
                templateCopy = _template.clone();

                currentVariables = content[i];
                scope = {
                    _meta: {
                        iteration: i,
                        first: (i === 0),
                        last: (i === contentLength)
                    }
                };
                scope[_asKey] = currentVariables;
                templateCopy.setVariables(scope);

                if(appendToNode) {
                    appendToNode.appendChild(templateCopy.render());
                    if (templateCopy instanceof IrLib.View.Template || typeof templateCopy.replaceSubviewPlaceholders === 'function') {
                        templateCopy.replaceSubviewPlaceholders();
                    }
                } else {
                    renderedContent += templateCopy.toString();
                }
            }
            return renderedContent;
        }

        /**
         * Sets the content to loop over
         *
         * @param {Array} content
         * @returns {LoopView}
         */
        setContent(content) {
            if (!Array.isArray(content)) {
                throw new TypeError('Argument "content" has to be of type object, ' + (typeof content) + ' given');
            }
            this._content = content;
            this._needsRedraw = true;
            return this;
        }

        /**
         * Returns the content to loop over
         *
         * @returns {Array}
         */
        getContent() {
            return this._content;
        }

        /**
         * Set the variables
         *
         * @param {Object|Dictionary} data
         * @return {ViewInterface}
         * @abstract
         */
        setVariables(data:Object) {
            this._super(data);
            if (typeof data.content !== 'undefined') {
                this.setContent(data.content);
                //    throw new TypeError('Loop View only accepts variables with a property called "content". See setContent()');
            }
            return this;
        }

        /**
         * Sets the key to use to access the current iteration value
         *
         * @param {string} asKey
         */
        setAsKey(asKey:string):this {
            this._asKey = asKey;
            return this;
        }

        /**
         * Returns the key to use to access the current iteration value
         *
         * @returns {string}
         */
        getAsKey():string {
            return this._asKey;
        }

        /**
         * Sets the template
         *
         * @param {ViewInterface|String} template
         */
        setTemplate(template) {
            if (!(template instanceof ViewInterface) && typeof template !== 'string') {
                throw new TypeError('Invalid type for template, ' + (typeof content) + ' given');
            }
            this._originalTemplate = template;
            return this;
        }

        /**
         * Returns the template
         *
         * @returns {ViewInterface}
         */
        getTemplateView() {
            if (!this._templateView) {
                this._templateView = this._createTemplateViewFromTemplate();
            }
            return this._templateView;
        }

        /**
         * Create the actual template view from the input template
         *
         * @returns {ViewInterface}
         * @private
         */
        _createTemplateViewFromTemplate() {
            var _serviceLocator = this.serviceLocator,
                _originalTemplate = this._originalTemplate,
                templateView;

            if (typeof _originalTemplate == 'string') {
                templateView = new IrLib.View.Template(_originalTemplate);
                if (_serviceLocator) {
                    _serviceLocator.resolveDependencies(templateView, IrLib.View.Template);
                }
            } else if (_originalTemplate instanceof ViewInterface) {
                templateView = _originalTemplate;
            } else {
                throw new TypeError('Invalid type for template, ' + (typeof content) + ' given');
            }

            return templateView;
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
    });
}
