import EventBuilder from "./EventBuilder.js";

export default class EventService {
    static #instance = null;
    #handlers = new WeakMap();

    constructor(){
        if (EventService.#instance){
            return EventService.#instance;
        }
        EventService.#instance = this;
    }

    #handler = (event)=>{return this.#invoke(event)}

    target(event, tag, depth=10){
        if (!(event instanceof Event)) {return null;}
        if (!event.target || !event.currentTarget) {return null;}
        let target = event.target;
        const current = event.currentTarget;
        if (typeof tag !== 'string'){return target;}
        tag = tag.trim().toUpperCase();
        if (!tag) {return target;}
        if (target === current) {
            if (current.nodeName === tag){return target;} else {return null;}
        }

        if (typeof tag === 'string'){
            let step = 0;
            while (step < depth && target != current){
                if (target.nodeName === tag) {return target;}
                if (!target.parentElement) {return null;}
                target = target.parentElement;
                step ++;
            }
        }
        return null;
    };


    has(target, event = null){
        if (!(target instanceof HTMLElement)){return false;}
        const hasTarget = this.#handlers.has(target);
        if (!hasTarget) {return false;}
        if (typeof event === 'string') {
            return Object.hasOwn(this.#handlers.get(target), event);
        }
        return true;
    }

    // 添加事件监听
    on(target, event, handler, options) {
        if (!(target instanceof HTMLElement)){throw new Error('Event target must be an HTMLElement')}
        if (typeof event !== 'string'){throw new Error('Event name must be a string')}
        if (typeof handler !== 'function'){throw new Error('Event handler must be a function')}
        let handlers = null;
        try {
            if (this.#handlers.has(target)){
                handlers = this.#handlers.get(target);
                if (!Object.hasOwn(handlers, event)){
                    target.addEventListener(event, this.#handler, options)
                }
            } else {
                handlers = Object.create(null);
                this.#handlers.set(target, handlers);
                target.addEventListener(event, this.#handler, options)
            }
            handlers[event] = handler;
            return this;
        } catch (error) {
            console.error('Failed to add event listener:', error)
            return this;
        }
    }

    select(element){return new EventBuilder(this, element);}
    register(builder){
        try {
            if (builder instanceof EventBuilder){
                this.#handlers.set(builder.element, builder.handlers);
                for (const type of Object.keys(builder.handlers)){
                    builder.element.addEventListener(type, this.#handler, builder.options[type]);
                }
            }
        } catch (error) {
            console.error('Failed to add event listener:', error);
            return false;
        }
    }

    once(target, event, handler, options = {}) {
        try {
            options.once = true;
            target.addEventListener(event, handler, options);
            return true;
        } catch (error) {
            console.error('Failed to add event listener:', error);
            return false;
        }
    }

    // 触发事件
    #invoke(event) {
        const type = event.type;
        let handler = null;
        if (this.has(event.currentTarget, type)){
            handler = this.#handlers.get(event.currentTarget)[type];
        } else if (this.has(event.target, type)) {
            handler = this.#handlers.get(event.target)[type];
        }
        if (typeof handler === 'function') {
            try {
                return handler(event);
            } catch (error) {
                console.error('Event emit error:', error);
                return false;
            }
        }
        return false;
    }

    emit(target, event){
        if (this.has(target, event)){
            const handler = this.#handlers.get(target)[event];
            try {
                return handler();
            } catch (error) {
                console.error('Event emit error:', error);
                return false;
            }
        }
        return false;
    }

    // 移除事件监听
    remove(target, event = null) {
        if (this.has(target)){
            let handlers = this.#handlers.get(target);
            if (typeof event === 'string'){
                if (!Object.hasOwn(handlers, event)) {return this;}
                handlers[event] = null;
                Reflect.deleteProperty(handlers, event);
                target.removeEventListener(event, this.#handler);
                if (Object.keys(handlers).length === 0) {this.#handlers.delete(target);}
            } else {
                for (const type of Object.keys(handlers)) {
                    handlers[type] = null;
                    target.removeEventListener(type, this.#handler);
                }
                handlers = null;
                this.#handlers.delete(target);
            }
        }
        return this;
    }


    debounce(func, delay = 300, immediate = false) {
        let timer = null;
        return function(...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            if (immediate && !timer) {func.apply(context, args); }
            timer = setTimeout(() => {
                timer = null;
                if (!immediate) {func.apply(context, args);}
            }, delay);
        };
    }

    throttle(func, delay = 300, trailing = true) {
        let timer = null;
        let lastExecTime = 0;
        return function(...args) {
            const context = this;
            const currentTime = Date.now();
            const remainingTime = delay - (currentTime - lastExecTime);
            if (timer) {clearTimeout(timer);timer = null;}
            if (remainingTime <= 0) {
                func.apply(context, args);
                lastExecTime = currentTime;
            } else if (trailing && !timer) {
                timer = setTimeout(() => {
                    func.apply(context, args);
                    lastExecTime = Date.now();
                    timer = null;
                }, remainingTime);
            }
        };
    }

    destroy() {
        this.#handlers = new WeakMap();
    }
}
