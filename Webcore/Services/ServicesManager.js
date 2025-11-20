export default class ServiceManager {
    static #instance = null;
    #services = new Map();
    #singletons = new Map();

    constructor(){
        if (ServiceManager.#instance){
            return ServiceManager.#instance;
        }
        ServiceManager.#instance = this;
    }


    #create(desc) {
        const depends = desc.depends.map(dep => this.get(dep));
        return new desc.service(...depends);
    }

    get(name){
        if (!this.has(name)){throw new Error(`Service '${name}' not registered`);}
        const desc = this.#services.get(name);
        if (desc.singleton) {
            if (!this.#singletons.has(name)) {
                this.#singletons.set(name, this.#create(desc));
            }
            return this.#singletons.get(name);
        } else {
            return this.#create(desc);
        }
    }

    has(name) {return this.#services.has(name);}
    serviceNames() {return Array.from(this.#services.keys());}


    register(name, service, options = {}) {
        if (typeof name === 'string' && typeof options === 'object'){
            const config = {singleton: false, depends: [], ...options};
            this.#services.set(name, {service, ...config});
        }
        return this;
    }

    addSingleton(name, service, deps = []) {
        return this.register(name, service, { singleton: true, depends: deps });
    }

    addTransient(name, service, deps = []) {
        return this.register(name, service, { singleton: false, depends: deps });
    }

    dispose() {
        this.#singletons.forEach(instance => {
            if (typeof instance.dispose === 'function') {instance.dispose();}
        });
        this.#services.clear();
        this.#singletons.clear();
    }

}
