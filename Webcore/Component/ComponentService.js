import ComponentBuilder from "./ComponentBuilder.js";

export default class ComponentService {
    static #instance = null;
    #components = new Map();

    constructor(){
        if (ComponentService.#instance) {
            return ComponentService.#instance;
        }
        Object.freeze(this);
        ComponentService.#instance = this;
    }

    createBuilder(){return new ComponentBuilder();}

    async load(url){
        if (typeof url !== 'string'){
            console.error('Url must be of string type.');
            return null;
        }
        const comp = new URL(url, location.origin);
        try {
            const request = await import(comp.href);
            const service = request.default;
            this.register(service);
            return new service.componentClass();
        } catch (error) {
            console.error('Component loading failed:',error.message);
            return null;
        }
    }

    has(name){
        if (typeof name !== 'string'){return false;}
        if (!name.includes('-')){name = `core-${name}`;}
        return this.#components.has(name);
    }

    get(name){
        if (typeof name !== 'string'){return null;}
        if (!name.includes('-')){name = `core-${name}`;}
        if (!this.has(name)){
            console.error('Component not registered, please register first');
            return null;
        }
        return this.#components.get(name).createInstance();
    }
    getClass(name){
        if (typeof name !== 'string'){return null;}
        if (!name.includes('-')){name = `core-${name}`;}
        if (!this.has(name)){
            console.error('Component not registered, please register first');
            return null;
        }
        return this.#components.get(name).getComponentClass();
    }

    register(component, tag = null){
        if (!tag && !component.name){console.error('Missing component tag name');return this;}
        const name = tag || component.name;
        if (!Object.hasOwn(component, 'componentClass')){console.error(`"${name}" component is invalid.`);return this;}
        if (this.has(name)) {console.error(`Component "${name}" is already registered, skipping.`);return this;}
        try {
            customElements.define(name, component.componentClass);
            this.#components.set(name, component);
            console.log(`Component "${name}" registered successfully.`);
            return this;
        } catch (error) {
            console.error(`Failed to register component "${name}": ${error.message}`);
            return this;
        }
    }

    registerAll(components) {
        if (typeof components !== 'object' || components === null) {
            console.error('Components must be provided as an object');
            return this;
        }
        Object.entries(components).forEach(([name, component]) => {
            this.register(component, name);
        });
        return this;
    }

    unregister(name) {
        if (!this.has(name)) {
            console.warn(`Component "${name}" is not registered.`);
            return false;
        }

        this.#components.delete(name);
        console.log(`Component "${name}" unregistered from service.`);
        return true;
    }

    clear() {
        const count = this.#components.size;
        this.#components.clear();
        console.log(`Cleared ${count} components from registry.`);
        return this;
    }
}
