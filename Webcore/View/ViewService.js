export default class nameService {
    static #instance = null;
    #components = new Map();

    constructor(){
        if (nameService.#instance) {
            return nameService.#instance;
        }
        Object.freeze(this);
        nameService.#instance = this;
    }

     // 事件回调注册
    register(name, handlers = {}){
        if (typeof name === 'string'){
            name = name.trim();
            if (name && typeof handlers === 'object'){
                if (Object.getPrototypeOf(handlers) !== null){
                    handlers = Object.assign(Object.create(null), handlers);
                }
                this.remove(name);
                this.#components.set(name, handlers);
                return true;
            }
        }
        return false;
    }

    // 检查是否已注册
    has(name){
        if (typeof name === 'string'){
            name = name.trim();
            return name && this.#components.has(name);
        }
        return false;
    }

    // 获取指定组件或事件的回调
    get(name, event = null){
        if (typeof name !== 'string'){throw new Error('The name name must be of string type.')}
        name = name.trim();
        if (name && this.has(name)){
            const handlers = this.#components.get(name);
            if (typeof handlers === 'object'){
                if (typeof event === 'string'){
                    event = event.trim();
                    if (event && Object.hasOwn(handlers, event)){return handlers[event];}
                } else {
                    return handlers;
                }
            }
        }
        return null;
    }

    // 组件卸载后手动销毁回调
    remove(name){
        if (typeof name === 'string'){
            name = name.trim();
            if (name && this.has(name)){
                this.#components.delete(name);
                return true;
            }
        }
        return false;
    }

    clear() {this.#components.clear();return true;}
}
