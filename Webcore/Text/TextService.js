import Encoding from "./Encoding.js";
// import Sanitize from "./Sanitize.js";

export default class TextService {
    static #instance = null;
    // sanitize = null;

    constructor(){
        if (TextService.#instance){return TextService.#instance;}
        Object.freezeProp(this, "encoding", new Encoding());
        // this.sanitize = new Sanitize();
        TextService.#instance = this;
    }

}
