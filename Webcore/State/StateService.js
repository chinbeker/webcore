export default class StateService {
    static #instance = null;
    constructor(){
        if (StateService.#instance){
            return StateService.#instance;
        }
        StateService.#instance = this;
    }
}
