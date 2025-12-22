export default class Configuration {
    #config = Object.create(null);

    constructor(){
        Object.freeze(this);
    }

    set(key, value) {this.#config[key] = value;return this;}
    has(key){return Object.hasOwn(this.#config, key);}
    get(key) {return this.#config[key];}
    delete(key){
        if (this.has(key)){
            delete this.#config[key];
        }
        return this;
    }
    clear(){
        for (const key of Object.keys(this.#config)){
            delete this.#config[key];
        }
        return this;
    }
    // getSection(section) {return this;}
}
