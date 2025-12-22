import Component from "./Component.js";
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

    builder(){return ComponentBuilder;}

    async load(url){
        if (typeof url !== 'string'){
            console.error('Url must be of string type.');
            return null;
        }
        const comp = new URL(url, Object.hasOwn(self,'app') && self.app.configuration.has('base') ? self.app.configuration.get('base') : location.origin);
        try {
            const request = await import(comp.href);
            const component = request.default;
            this.register(component);
            return new component();
        } catch (error) {
            console.error('Component loading failed:',error.message);
            return null;
        }
    }

    has(name){
        name = ComponentBuilder.check(name);
        if (name === null) {return false;}
        return this.#components.has(name);
    }

    get(name){
        name = ComponentBuilder.check(name);
        if (name === null) {return null;}
        if (!this.has(name)){
            console.error('Component not registered, please register first');
            return null;
        }
        return this.#components.get(name).createInstance();
    }
    getClass(name){
        name = ComponentBuilder.check(name);
        if (name === null) {return null;}
        if (!this.has(name)){
            console.error('Component not registered, please register first');
            return null;
        }
        return this.#components.get(name).getComponentClass();
    }

    register(component, tag = null){
        if (!tag && !component.tagName){console.error('Missing component tag name');return this;}
        let name = tag || ComponentBuilder.check(component.tagName);
        if (this.has(name)) {console.error(`Component "${name}" is already registered, skipping.`);return this;}
        try {
            customElements.define(name, component);
            const meta = new Component(name, component);
            this.#components.set(name, meta);
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
