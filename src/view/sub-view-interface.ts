/**
 * Created by COD on 25.06.15.
 */


export namespace IrLib {
    namespace View {
        /**
         * Defines the interface for Views that can be used as subview inside another View
         */
        interface SubViewInterface {
            /**
             * Returns the string representation of the rendered template
             *
             * @returns {string}
             */
            toString ():string;

        }
    }
}
