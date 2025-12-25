import GlobalData from "./GlobalData.js";

export default class GlobalService {
    static #instance = null;
    #system = new GlobalData()
    #vars = new GlobalData()
    #state = new GlobalData()

    constructor(){
        if (GlobalService.#instance){
            return GlobalService.#instance;
        }
        Object.freeze(this);
        GlobalService.#instance = this;
    }


    get vars(){return this.#vars;}
    get system(){return this.#system;}
    get state(){return this.#state;}
}
