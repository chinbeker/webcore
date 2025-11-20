export default class CacheService {
    static #instance = null;
    #caches = new Map();
    constructor(){
        if (CacheService.#instance){
            return CacheService.#instance;
        }
        CacheService.#instance = this;
    }


}
