import Encoding from './Encoding.js';
import Sanitize from './Sanitize.js';

export default class TextService {
    static #instance = null;
    encoding = null;
    sanitize = null;

    constructor(){
        if (TextService.#instance){
            return TextService.#instance;
        }
        this.encoding = new Encoding();
        this.sanitize = new Sanitize();
        Object.freeze(this);
        TextService.#instance = this;
    }

}
