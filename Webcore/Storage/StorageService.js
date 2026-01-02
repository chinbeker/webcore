// import Database from "./Database.js";

export default class StorageService {
    static #instance = null;

    // #size = 1024 * 1024 * 5;
    // #origin = location.origin;

    // #database = new Database();
    // static #database = null;

    constructor(){
        if (StorageService.#instance){return StorageService.#instance;}
        Object.freezeProp(Map.prototype, "toObject",
            function toObject(){
                const obj = Object.pure();
                for (const [key, value] of this.entries()){
                    if (typeof key === "string" || (typeof key === "number" && Number.isFinite(key))){
                        obj[key] = value;
                    }
                }
                return obj;
            }
        );
        Object.freezeProp(Map.prototype, "toJSON",function toJSON(){return this.toObject();});
        Object.freezeProp(Set.prototype, "toArray",function toArray(){return Array.from(this);});
        Object.freezeProp(Set.prototype, "toJSON",function toJSON(){return this.toArray();});
        Object.freezeProp(StorageService, "validateKey",
            function validateKey(key){
                if (typeof key !== "string" && typeof key !== "number"){
                    throw new TypeError("Key must be string or number.");
                }
                if (typeof key === "number"){key = key.toString();}
                if (String.isNullOrWhiteSpace(key)){
                    throw new TypeError("Key cannot be empty.")
                }
                return key.trim();
            }
        );
        StorageService.#instance = this;
    }

    // get database(){return StorageService.#database;}
    get length(){return localStorage.length;}

    has(key){
        key = StorageService.validateKey(key);
        return localStorage.getItem(key) !== null;
    }
    set(key, value){
        key = StorageService.validateKey(key);
        if (value == null){
            localStorage.removeItem(key);
            return this;
        }
        localStorage.setItem(key, JSON.stringify(value));
        return this;
    }
    get(key, defaultValue = null){
        key = StorageService.validateKey(key);
        const value = localStorage.getItem(key);
        try {
            return value === null ? defaultValue : JSON.parse(value);
        } catch (error) {
            console.warn(`Failed to parse JSON for key "${key}": `, error);
            return value;
        }
    }
    keys(){return Object.keys(localStorage);}

    entries() {
        const result = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            try {
                result.push([key, JSON.parse(value)]);
            } catch (error) {
                result.push([key, value]);
            }
        }
        return result;
    }

    delete(key){
        key = StorageService.validateKey(key);
        localStorage.removeItem(key);
        return this;
    }
    clear(){
        localStorage.clear();
        return this;
    }
}
