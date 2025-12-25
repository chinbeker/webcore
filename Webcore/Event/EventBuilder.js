export default class EventBuilder {
    service = null;
    element = null;
    handlers = Object.create(null);
    options = Object.create(null);
    empty = Object.create(null);

    constructor(service, element){
        if (!(element instanceof HTMLElement)){throw new TypeError('Event target must be an HTMLElement')}
        this.service = service;
        this.element = element;
    }

    on(event, handler, options = null){
        if (typeof event !== 'string'){throw new TypeError('Event name must be a string')}
        if (typeof handler !== 'function'){throw new TypeErrorv('Event handler must be a function')}
        this.handlers[event] = handler;
        this.options[event] = options ? options : this.empty;
        return this;
    }

    has(event){
        if (typeof event === 'string'){return Object.hasOwn(this.handlers, event);}
        return false;
    }
    get(event){
        if (this.has(event)) {return this.handlers[event];}
        return null;
    }

    remove(event){
        if (this.has(event)){
            this.handlers[event] = null;
            Reflect.deleteProperty(this.handlers, event);
            if (Object.hasOwn(this.options, event)){
                this.options[event] = null;
                Reflect.deleteProperty(this.options, event);
            }
        }
        return this;
    }

    bind(){
        if (!this.service) {throw new TypeError('EventService instance is missing');}
        this.service.register(this);
        return this;
    }

    // 代理常用事件方法
    once(event, handler, options = null){
        if (!options){options = this.empty}
        options.once = true;
        return this.on(event, handler, options);
    }
    click(handler, options) {return this.on('click', handler, options);}
    submit(handler, options) {return this.on('submit', handler, options);}
    reset(handler, options) {return this.on('reset', handler, options);}
    invalid(handler, options) {return this.on('invalid', handler, options);}
    resize(handler, options) { return this.on('resize', handler, options);}
    scroll(handler, options) {return this.on('scroll', handler, options);}
    focus(handler, options) {return this.on('focus', handler, options);}
    blur(handler, options) {return this.on('blur', handler, options);}
    change(handler, options) {return this.on('change', handler, options);}
    input(handler, options) {return this.on('input', handler, options);}
    keydown(handler, options) {return this.on('keydown', handler, options);}
    toggle(handler, options) {return this.on('toggle', handler, options);}
    show(handler, options) {return this.on('show', handler, options);}
    open(handler, options) {return this.on('open', handler, options);}
    close(handler, options) {return this.on('close', handler, options);}
    error(handler, options) {return this.on('error', handler, options);}
    message(handler, options) {return this.on('message', handler, options);}
    dblclick(handler, options) {return this.on('dblclick', handler, options);}
    contextmenu(handler, options) {return this.on('contextmenu', handler, options);}
    hover(enterHandler, leaveHandler, options) {this.on('mouseenter', enterHandler, options);this.on('mouseleave', leaveHandler, options);return this;}
}
