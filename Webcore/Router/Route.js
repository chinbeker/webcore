export default class Route {
    static keys = ["from", "to", "name", "params", "meta", "view"]
    constructor(mode, routing, replace=false){
        Error.throwIfNull(routing, "Routing");
        Object.freezeProp(this, "mode", mode);
        Object.freezeProp(this, "replace", replace);
        if (typeof routing === "string"){
            Object.freezeProp(this, "to", routing);
            this.setPath(routing);
        } else if (Object.isObject(routing)){
            Error.throwIfNotHasOwn(routing, "to", "To");
            this.setPath(routing.to);
            for (const key of Route.keys){
                if (Object.hasOwn(routing, key)){
                    Object.freezeProp(this, key, routing[key])
                }
            }
        }
        if (!Object.hasOwn(this, "from")){
            if (mode === "hash"){
                Object.freezeProp(this, "from", location.hash.replace("#",""));
            } else if (mode === "history") {
                Object.freezeProp(this, "from", location.pathname);
            }
        }
        if (!Object.hasOwn(this, "view")){
            Object.freezeProp(this, "view", "default")
        }
    }

    setPath(routing){
        const url = new URL(routing, location.origin);
        Object.sealProp(this, "path", url.pathname);
    }
}
