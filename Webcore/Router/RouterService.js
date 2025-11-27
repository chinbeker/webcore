export default class RouterService {
    static #instance = null;
    #handlers = null;
    #routes = null;

    constructor(){
        if (RouterService.#instance){return RouterService.#instance;}
        top.history.replaceState(true, null, location.origin + location.pathname);
        const handlers = Object.create(null);
        handlers.top = (ev)=>{ev.preventDefault();top.location.replace(ev.currentTarget.dataset.href);};
        handlers.parent = (ev)=>{ev.preventDefault();parent.location.replace(ev.currentTarget.dataset.href);};
        handlers.blank = (ev)=>{ev.preventDefault();self.open(ev.currentTarget.dataset.href, '_blank');};
        handlers.assign = (ev)=>{ev.preventDefault();location.assign(ev.currentTarget.dataset.href);};
        handlers.replace = (ev)=>{ev.preventDefault();location.replace(ev.currentTarget.dataset.href);};
        this.#handlers = handlers;
        if (document.documentElement.classList.contains('webcore')){
            top.addEventListener('DOMContentLoaded',()=>{
                this.init();this.anchor(document.body);
            },{once:true})
        };
        Object.freeze(this);
        RouterService.#instance = this;
    }

    init(){
        this.#handlers.frames = Object.create(null);
        const length = top.frames.length;
        for (let i = 0;i < length;i ++){
            const handler = Object.create(null);
            handler.frame = top.frames[i];
            handler.assign = (ev)=>{ev.preventDefault();
                handler.frame.location.assign(ev.currentTarget.dataset.href);
            }
            handler.replace = (ev)=>{ev.preventDefault();
                handler.frame.location.replace(ev.currentTarget.dataset.href);
            }
            const name = top.frames[i].name || 'view';
            this.#handlers.frames[name] = handler;
        }
    }

    anchor(element){
        if (!(element instanceof HTMLElement)) {return false;}
        if (element.childElementCount == 0){element = element.parentElement}
        element.querySelectorAll('a[data-href]').forEach(el=>{
            const target = el.hasAttribute('data-target') ? el.dataset.target.trim() : false;
            const iframe = el.hasAttribute('data-iframe') ? el.dataset.iframe.trim() : false;
            if (target){
                if (target === 'top') {el.onclick = this.#handlers.top;return true;}
                if (target === 'parent') {el.onclick = this.#handlers.parent;return true;}
                if (target === 'blank') {el.onclick = this.#handlers.blank;return true;}
            }
            if (iframe && Object.hasOwn(this.#handlers.frames, iframe)){
                if (target && target === 'self') {el.onclick = this.#handlers.frames[iframe].replace;return true;}
                el.onclick = this.#handlers.frames[iframe].assign;return true;
            }
            if (target && target === 'self') {el.onclick = this.#handlers.replace;return true;}
            el.onclick = this.#handlers.assign;return true;
        });
        return true;
    };
}
