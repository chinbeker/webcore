export default class Configuration {
    #config = new Map();
    constructor(){

    }

    set(key, value) {
        this.#config.set(key, value);
        return this;
    }

    has(key){
        return this.#config.has(key);
    }

    get(key) {
        return this.#config.get(key);
    }

    delete(key){
        if (this.#config.has(key)){
            this.#config.delete(key);
        }
        return this;
    }

    clear(){
        this.#config.clear();
        return this;
    }

    getSection(section) {}
}
