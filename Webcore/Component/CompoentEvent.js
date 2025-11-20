export default class ComponentEvent {
    static #instance = null;
    #handlers = new Map();

    constructor(){
        if (ComponentEvent.#instance) {
            return ComponentEvent.#instance;
        }
        ComponentEvent.#instance = this;
    }

     // 事件回调注册
    on(component, handlers = {}){
        if (typeof component === 'string'){
            component = component.trim();
            if (component && typeof handlers === 'object'){
                if (Object.getPrototypeOf(handlers) !== null){
                    handlers = Object.assign(Object.create(null), handlers);
                }
                this.off(component);
                this.#handlers.set(component, handlers);
                return true;
            }
        }
        return false;
    }

    // 检查是否已注册
    has(component){
        if (typeof component === 'string'){
            component = component.trim();
            return component && this.#handlers.has(component);
        }
        return false;
    }

    // 获取指定组件或事件的回调
    get(component, event = null){
        if (typeof component !== 'string'){throw new Error('The component name must be of string type.')}
        component = component.trim();
        if (component && this.has(component)){
            const handlers = this.#handlers.get(component);
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
    off(component){
        if (typeof component === 'string'){
            component = component.trim();
            if (component && this.has(component)){
                this.#handlers.delete(component);
                return true;
            }
        }
        return false;
    }

    clear() {this.#handlers.clear();return true;}
}
