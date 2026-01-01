export default class ViewService {
    static #instance = null;
    #views = new Map();

    constructor(){
        if (ViewService.#instance) {return ViewService.#instance;}
        Object.freeze(this);
        ViewService.#instance = this;
    }

}
