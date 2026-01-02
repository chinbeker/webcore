import GlobalData from "./GlobalData.js";

export default class GlobalService {
    static #instance = null;

    constructor(){
        if (GlobalService.#instance){return GlobalService.#instance;}
        Object.freezeProp(GlobalService,"system",new GlobalData());
        Object.freezeProp(GlobalService,"vars",new GlobalData());
        Object.freezeProp(GlobalService,"state",new GlobalData());
        Object.freeze(GlobalService);
        Object.freeze(this);
        GlobalService.#instance = this;
    }


    get vars(){return GlobalService.vars;}
    get system(){return GlobalService.system;}
    get state(){return GlobalService.state;}
}
