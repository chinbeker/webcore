import Component from "./Component.js";
import ComponentBuilder from "./ComponentBuilder.js";

export default class ComponentService {
    static #instance = null;

    #components = new Map();

    constructor(){
        if (ComponentService.#instance) {return ComponentService.#instance;}
        Object.freezeProp(this, "builder", ComponentBuilder);
        Object.freeze(this);
        ComponentService.#instance = this;
    }

    async load(url, tag){
        url = URL.create(url);
        try {
            const request = await import(url.href);
            const component = request.default;
            this.register(component, tag);
            return component;
        } catch {
            throw new Error("Component loading failed.");
        }
    }

    has(name){
        name = ComponentBuilder.check(name);
        return this.#components.has(name);
    }

    get(name){
        name = ComponentBuilder.check(name);
        if (!this.#components.has(name)){
            throw new Error("Component not registered, please register first");
        }
        return this.#components.get(name).createInstance();
    }
    getClass(name){
        name = ComponentBuilder.check(name);
        if (!this.#components.has(name)){
            throw new Error("Component not registered, please register first");
        }
        return this.#components.get(name).getComponentClass();
    }

    register(component, tag){
        if (Object.getPrototypeOf(component) !== ComponentBuilder){
            throw new Error('The component is invalid and is not a "webcore" component.');
        }
        if (String.isNullOrWhiteSpace(tag)){
            if (String.isNullOrWhiteSpace(component.tag)){throw new Error("Missing component tag name.");}
            tag = ComponentBuilder.check(component.tag)
        } else {
            tag = ComponentBuilder.check(tag);
        }
        if (this.#components.has(tag)) {
            throw new Error(`Component "${tag}" is already registered, skipping.`);
        }
        try {
            customElements.define(tag, component);
            const meta = new Component(tag, component);
            this.#components.set(tag, meta);
            console.log(`Component "${tag}" registered successfully.`);
            return this;
        } catch (error) {
            throw new Error(`Failed to register component "${tag}": ${error.message}.`);
        }
    }

    registerAll(components) {
        Error.throwIfNotObject(components);
        Object.entries(components).forEach(([tag, component]) => {
            this.register(component, tag);
        });
        return this;
    }

    clear() {
        this.#components.clear();
        return this;
    }
}
