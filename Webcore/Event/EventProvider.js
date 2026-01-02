export default class EventProvider {
    static #instance = null;

    constructor(){
        if (EventProvider.#instance) {return EventProvider.#instance;}
        Object.freezeProp(EventProvider, "events", new Map());
        Object.freeze(EventProvider);
        Object.freeze(this);
        EventProvider.#instance = this;
    }

     // 事件回调注册
    expose(name, handlers = {}){
        name = String.toNotEmptyString(name, "Provider");
        if (Object.isObject(handlers)){
            EventProvider.events.delete(name);
            EventProvider.events.set(name, Object.pure(handlers, false));
            return true;
        }
        return false;
    }

    // 检查是否已注册
    has(name){
        name = String.toNotEmptyString(name, "Provider");
        return EventProvider.events.has(name);
    }

    // 获取指定组件或事件的回调
    use(name, event = null){
        name = String.toNotEmptyString(name, "Provider");
        if (this.has(name)){
            const handlers = EventProvider.events.get(name);
            if (Object.isObject(handlers)){
                if (!String.isNullOrWhiteSpace(event)){
                    event = event.trim();
                    if (Object.hasOwn(handlers, event)){return handlers[event];}
                } else {
                    return handlers;
                }
            }
        }
        return null;
    }

    // 组件卸载后手动销毁回调
    delete(name){
        name = String.toNotEmptyString(name, "Provider");
        EventProvider.events.delete(name);
        return this;
    }

    clear() {EventProvider.events.clear();return true;}
}
