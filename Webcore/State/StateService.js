import StateData from "./StateData.js";

export default class StateService {
    static #instance = null;
    #state = new StateData();

    constructor(){
        if (StateService.#instance){
            return StateService.#instance;
        }
        StateService.#instance = this;
    }

    has(key){return this.#state.has(key);}
    get(key){return this.#state.get(key);}
    add(key, value){this.#state.set(key, value);return this;}
    set(key, value){this.#state.set(key, value);return this;}
    delete(key){this.#state.delete(key);return this;}
    remove(key){this.#state.delete(key);return this;}
    clear(){return this.#state.clear();}
}
