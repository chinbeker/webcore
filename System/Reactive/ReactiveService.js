import ReactiveElement from "./ReactiveElement.js";
import ReactiveStore from "./ReactiveStore.js";

export default class ReactiveService {
    static #instance = null;
    constructor(){
        if (ReactiveService.#instance){
            return ReactiveService.#instance;
        }
        ReactiveService.#instance = this;
    }

    element(tag = 'div', content = ''){
        if (typeof tag !== 'string'){ throw new Error('Element tag name must be a string value');}
        return new ReactiveElement(tag, content);
    }

    store(value){
        return new ReactiveStore(value);
    }
}
