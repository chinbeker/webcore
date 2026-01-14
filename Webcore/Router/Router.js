import RouterService from "./RouterService.js";
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
        return true;
    }

    push(to){
        this.#routing(new Route(this.mode, to, false));
        return true;
    }

    replace(to){
        this.#routing(new Route(this.mode, to, true));
        return true;
    }

    // 路由渲染
    async #render(pathname, route, views, root, target){
        if (views.length > 0){
            try {
                const results = await Promise.all(
                    views.map(view => view.routeCallback(route.view))
                );
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

        // 路由之后的回调
        if (typeof target.onRouteAfter === "function"){
            target.onRouteAfter(route);
        }
        this.#history(pathname, route);
    }

    // 地址栏改变
    #history(pathname, route){
        if (this.mode === "history"){
            pathname = `${RouterService.instance.base}${pathname}`
        } else {
            pathname = `${RouterService.instance.base}/#${pathname}`;
        }
        if (route.replace){
            top.history.replaceState(route, "", pathname)
        } else {
            top.history.pushState(route, "", pathname)
        }
        return true;
    }

    // 路由入口
    async #routing(route){
        const pathname = this.routes.pathname(route);
        if (pathname === null) {return false;}
        const routes = this.routes.get(pathname);
        if (routes.length === 0){return false;}
        const views = [];

        // 拿到所有组件实例
        for (const route of routes){
            const component = route.component;
            component.routing = true;
            if (route.cache === true){
                if (!this.views.has(route.path)){
                    this.views.set(route.path, new component())
                }
                views.push(this.views.get(route.path));
            } else {
                views.push(new component());
            }
            component.routing = false;
        }

        const root = views[0];
        const target = views.pop();
        target.routeCallback(route.view);

        // 路由之前的回调
        if (typeof target.onRouteBefore === "function"){
            const next = await target.onRouteBefore(route);
            if (next === false){
                return false;
            } else if (Object.isObject(next) && !String.isNullOrWhiteSpace(next.to)){
                return this.to(next);
            } else {
                this.#render(pathname, route, views, root, target);
            }
        } else {
            this.#render(pathname, route, views, root, target);
        }
        return true;
    }

    start(to){
        if (this.mode === "history"){
            if (location.pathname.endsWith("/index.html")){
                this.replace("/");
            } else {
                this.replace(location.pathname.replace(RouterService.instance.base,""));
            }
        } else if (location.hash){
            this.replace(location.hash.replace("#",""));
        } else {
            this.replace("/");
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
