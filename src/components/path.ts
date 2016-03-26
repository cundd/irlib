/**
 * Created by daniel on 25/03/16.
 */
export default class Path {
    /**
     *
     */
    components:Array<String>;

    /**
     *
     * @param path
     */
    constructor(path:String) {
        this.components = path.split('/');
    }

    /**
     *
     * @returns {string}
     */
    toString():String {
        return this.components.join('/');
    }

}

