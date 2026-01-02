export default class RouterService {
    static #instance = null;

    constructor(){
        if (RouterService.#instance){return RouterService.#instance;}
        top.history.replaceState(true, null, location.origin + location.pathname);
        Object.freezeProp(RouterService, "handlers", Object.pure());
        const handlers = RouterService.handlers;
        handlers.top = (ev)=>{ev.preventDefault();top.location.replace(ev.currentTarget.dataset.href);};
        handlers.parent = (ev)=>{ev.preventDefault();parent.location.replace(ev.currentTarget.dataset.href);};
        handlers.blank = (ev)=>{ev.preventDefault();self.open(ev.currentTarget.dataset.href, "_blank");};
        handlers.assign = (ev)=>{ev.preventDefault();location.assign(ev.currentTarget.dataset.href);};
        handlers.replace = (ev)=>{ev.preventDefault();location.replace(ev.currentTarget.dataset.href);};
        if (document.documentElement.classList.contains("webcore")){
            top.addEventListener("DOMContentLoaded",()=>{
                this.init();this.anchor(document.body);
            },{once:true})
        };
        Object.freeze(RouterService);
        Object.freeze(this);
        RouterService.#instance = this;
    }

    init(){
        RouterService.handlers.frames = Object.pure();
        const length = top.frames.length;
        for (let i = 0;i < length;i ++){
            const handler = Object.pure();
            handler.frame = top.frames[i];
            handler.assign = (ev)=>{ev.preventDefault();
                handler.frame.location.assign(ev.currentTarget.dataset.href);
            }
            handler.replace = (ev)=>{ev.preventDefault();
                handler.frame.location.replace(ev.currentTarget.dataset.href);
            }
            const name = top.frames[i].name || "view";
            RouterService.handlers.frames[name] = handler;
        }
    }

    anchor(element){
        if (!(element instanceof HTMLElement)) {return false;}
        if (element.childElementCount == 0){element = element.parentElement}
        element.querySelectorAll("a[data-href]").forEach(el=>{
            const target = el.hasAttribute("data-target") ? el.dataset.target.trim() : false;
            const iframe = el.hasAttribute("data-iframe") ? el.dataset.iframe.trim() : false;
            if (target){
                if (target === "top") {el.onclick = RouterService.handlers.top;return true;}
                if (target === "parent") {el.onclick = RouterService.handlers.parent;return true;}
                if (target === "blank") {el.onclick = RouterService.handlers.blank;return true;}
            }
            if (iframe && Object.hasOwn(RouterService.handlers.frames, iframe)){
                if (target && target === "self") {el.onclick = RouterService.handlers.frames[iframe].replace;return true;}
                el.onclick = RouterService.handlers.frames[iframe].assign;return true;
            }
            if (target && target === "self") {el.onclick = RouterService.handlers.replace;return true;}
            el.onclick = RouterService.handlers.assign;return true;
        });
        return true;
    };
}
