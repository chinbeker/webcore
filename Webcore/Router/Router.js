import RouteSheet from "./RouteSheet.js";
import Route from "./Route.js";


// router-view 容器元素
class RouterView extends HTMLElement {
    constructor(){super()}
    render(view){
        this.replaceChildren(view)
    }
    clear(){
        this.replaceChildren()
    }
}
customElements.define('router-view', RouterView);


// 路由器
export default class Router {

    constructor(mode, view, routes){
        Object.freezeProp(this, "views", new Map());
        Object.freezeProp(this, "mode", Router.check(mode));
        if (!(view instanceof RouterView)){
            throw new TypeError('Invalid "router-view" element.');
        }
        Object.freezeProp(this, "view", view);
        this.useRoute(routes);
    }

    // to
    to(routing){
        Error.throwIfNotObject(routing)
        if (routing.replace === true){
            this.replace(routing);
        } else {
            this.push(routing);
        }
    }

    push(to){
        return this.render(new Route(this.mode, to, false));
    }

    replace(to){
        return this.render(new Route(this.mode, to, true));
    }


    async render(route){
        console.log(route)
        const pathname = this.routes.pathname(route);
        if (pathname === null) {return false;}
        const routes = this.routes.get(pathname);
        if (routes.length === 0){return false;}
        const views = [];
        // 拿到所有组件实例
        for (const route of routes){
            const component = route.component;
            component.router = true;
            if (route.cache === true){
                if (!this.views.has(route.path)){
                    this.views.set(route.path, new component())
                }
                views.push(this.views.get(route.path));
            } else {
                views.push(new component());
            }
            component.router = false;
        }

        const root = views[0];

        const target = views.pop();
        target.routeCallback(route);

        if (views.length > 0){
            try {
                const results = await Promise.all(views.map(view => view.routeCallback(route)));
                const len = results.length-1;
                if (len > 0){
                    for (let i = 0;i < len;i ++){
                        results[i].render(views[i+1]);
                    }
                }
                results[len].render(target);
            } catch {
                return false;
            }
        }

        // 检查一级路由是否已经在DOM中，避免重复渲染
        if (!this.view.contains(root)){
            this.view.render(root)
        }

        // 地址栏改变
        let address = pathname;
        if (this.mode === "history"){
            address = `${location.origin}${pathname}`
        } else {
            address = `${location.origin}#${pathname}`;
        }
        if (route.replace){
            top.history.replaceState(route, "", address)
        } else {
            top.history.pushState(route, "", address)
        }
        address = null;
        return true;
    }


    start(to){
        if (this.mode === "history"){
            if (location.pathname === "/index.html"){
                this.replace("/");
            } else {
                this.replace(location.pathname);
            }
        } else {
            if (location.hash){
                this.replace(location.hash.replace("#",""));
            } else {
                this.replace("/");
            }
        }
        return true;
    }


    useRoute(routes){
        Error.throwIfNotArray(routes, "Routes")
        if (Object.hasOwn(this, "routes")){
            for (const route of routes){
                this.routes.set(route);
            }
        } else {
            Object.freezeProp(this, "routes", new RouteSheet(routes));
        }
        return this;
    }

    static check(mode){
        mode = String.toNotEmptyString(mode, "Router mode");
        if (["hash", "history"].includes(mode)){
            return mode;
        } else {
            throw new TypeError('Router mode must be "hash" or "history".')
        }
    }

}
