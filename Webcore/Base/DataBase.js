export default class DataBase {
    #data = null;

    constructor(data = null){
        if (Object.isObject(data) && Object.hasPrototype(data)){
            Object.setPrototypeOf(data, null);
            this.#data = data;
        } else {this.#data = Object.create(null)}
        Object.freeze(this);
    }

    get count(){return Object.keys(this.#data).length}
    add(key, value){this.set(key, value);return this;}
    has(key){return Object.hasOwn(this.#data, key)}
    set(key, value){this.#data[key] = value;return this;}
    get(key){return this.has(key) ? this.#data[key] : null;}
    keys(){return Object.keys(this.#data);}
    delete(key){if(this.has(key)){delete this.#data[key]}return this;}
    remove(key){return this.delete(key);}
    clear(){for (const key of Object.keys(this.#data)){delete this.#data[key]}return true;}
}
