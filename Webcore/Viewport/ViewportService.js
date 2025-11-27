import Orientation from "./Orientation.js";
import ViewportObserver from "./ViewportObserver.js";

export default class ViewportService {
    static #instance = null;
    orientation = null;
    observe = null;

    constructor(){
        if (ViewportService.#instance){return ViewportService.#instance}
        this.orientation = new Orientation();
        this.observe = new ViewportObserver();
        Object.freeze(this);
        ViewportService.#instance = this;
    }

    get landscape(){return this.orientation.landscape;}
    get portrait(){return this.orientation.portrait;}

    destroy() {
        ViewportService.#instance = null;
    }
}
