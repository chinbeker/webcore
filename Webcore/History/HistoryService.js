import RouterService from "../Router/RouterService.js";

export default class HistoryService {
    constructor(){
        if (HistoryService.instance){return HistoryService.instance;}
        this.history=[];

        Object.freezeProp(HistoryService, "instance", this)
    }

    get state(){return top.history.state;}


    useRouter(mode="hash"){
        Object.freezeProp(this, "mode", mode);
        if (this.mode === "hash"){
            top.onhashchange = function hashchange(event){
                top.webcore.router.replace(location.hash.replace("#",""));
            }
        }
         else if (this.mode === "history"){
            top.onpopstate = function pathchange(event){
                top.webcore.router.replace(location.pathname.replace(RouterService.instance.base, ""));
            };
        }
    }

    back(){top.history.back()}
    go(index){top.history.go(index)}
    forward(){top.history.forward()}
}
