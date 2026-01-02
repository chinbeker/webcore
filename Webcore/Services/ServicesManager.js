export default class ServiceManager {
    static #instance = null;

    constructor(){
        if (ServiceManager.#instance){return ServiceManager.#instance;}
        Object.freezeProp(ServiceManager, "services", new Map());
        Object.freezeProp(ServiceManager, "singletons", new Map());
        Object.freeze(this);
        ServiceManager.#instance = this;
        Object.freeze(ServiceManager);
    }


    #create(service) {
        const dependency = service.dependency.map(dep => this.get(dep));
        return new service.constructor(...dependency);
    }

    serviceNames() {return Array.from(ServiceManager.services.keys());}
    has(name) {return ServiceManager.services.has(name);}

    get(name){
        if (!this.has(name)){throw new Error(`The "${name}" service is not registered.`);}
        const service = ServiceManager.services.get(name);
        if (service.singleton) {
            if (!ServiceManager.singletons.has(name)) {
                ServiceManager.singletons.set(name, this.#create(service));
            }
            return ServiceManager.singletons.get(name);
        } else {
            return this.#create(service);
        }
    }

    register(name, service, options = {}) {
        name = String.toNotEmptyString(name, "Service name");
        if (this.has(name)){throw new Error(`The "${name}" service has already been registered.`);}
        if (typeof service !== "function"){throw new Error(`The "${name}" service to be registered is invalid.`)}
        Error.throwIfNotObject(options, "Service options");
        const config = {singleton: false, dependency: [], ...options};
        ServiceManager.services.set(name, {constructor: service, ...config});
        return this;
    }

    addSingleton(name, service, deps = []) {
        return this.register(name, service, {singleton: true, dependency: deps});
    }

    addTransient(name, service, deps = []) {
        return this.register(name, service, {singleton: false, dependency: deps});
    }

    destroy() {
        ServiceManager.singletons.forEach(instance => {
            if (typeof instance.destroy === "function") {instance.destroy();}
        });
        ServiceManager.services.clear();
        ServiceManager.singletons.clear();
    }

}
