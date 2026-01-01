import GlobalData from "./GlobalData.js";

export default class GlobalService {
    static #instance = null;

    constructor(){
        if (GlobalService.#instance){return GlobalService.#instance;}
        Object.defineFreezeProperty(GlobalService,"system",new GlobalData());
        Object.defineFreezeProperty(GlobalService,"vars",new GlobalData());
        Object.defineFreezeProperty(GlobalService,"state",new GlobalData());
        Object.freeze(GlobalService);
        Object.freeze(this);
        GlobalService.#instance = this;
    }


    get vars(){return GlobalService.vars;}
    get system(){return GlobalService.system;}
    get state(){return GlobalService.state;}
}
