import ViewportObserver from "./ViewportObserver.js";

export default class ViewportService {
    static #instance = null;

    constructor(){
        if (ViewportService.#instance){return ViewportService.#instance}
        Object.freezeProp(this, "observe", new ViewportObserver());
        ViewportService.#instance = this;
    }

    destroy(){ViewportService.#instance = null;}
}
