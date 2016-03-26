/**
 * Created by COD on 25.06.15.
 */

export namespace IrLib {
    namespace View {
        /**
         * Defines a common interface for Views
         */
        interface ViewInterface extends SubViewInterface {
            /**
             * Renders the template
             *
             * @return {Node|HTMLElement}
             * @abstract
             */
            render():any;

            /**
             * Set the variables
             *
             * @param {Object|Dictionary} data
             * @return {ViewInterface}
             * @abstract
             */
            setVariables(data:any):this;

            /**
             * Add the variable with the given key and value
             *
             * @param {string} key
             * @param {*} value
             * @abstract
             */
            assignVariable(key:string, value:any):this;

            /**
             * Appends the View to the given DOM element, while replacing the previously rendered element
             *
             * @param {Node|HTMLElement} element
             * @return {ViewInterface}
             * @abstract
             */
            appendTo(element:any):this;

            /**
             * Removes the element from it's parent
             *
             * @returns {ViewInterface}
             * @abstract
             */
            remove():this;

            /**
             * Adds the given event listener to the View
             *
             * @param {string} type
             * @param {EventListener|Function} listener
             * @param {Boolean} [useCapture]
             * @abstract
             */
            addEventListener(type:string, listener:any, useCapture:boolean);

            /**
             * Dispatches an Event at the View, invoking the affected EventListeners in the appropriate order.
             *
             * The normal event processing rules (including the capturing and optional bubbling phase) apply to events
             * dispatched manually with dispatchEvent().
             *
             * @param {Event} event
             * @return {Boolean}
             * @abstract
             */
            dispatchEvent(event:Event);

            /**
             * Returns the string representation of the rendered template
             *
             * @returns {string}
             * @abstract
             */
            toString():string;
        }
    }
}
