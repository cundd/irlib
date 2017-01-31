/**
 * Created by COD on 14.04.15.
 */
import Error from './error';

export default class TypeError extends Error {
    toString() {
        return '[IrLib.TypeError] ' +
            (this.code ? '#' + this.code + ':' : '') +
            this.message;
    }
}
