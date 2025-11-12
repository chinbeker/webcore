import ComponentBuilder from "./ComponentBuilder.js";

export default class ComponentService {
    static #instance = null;
    #components = new Map();

    constructor(){
        if (ComponentService.#instance) {
            return ComponentService.#instance;
        }
        ComponentService.#instance = this;
    }

    static createBuilder(){
        return new ComponentBuilder();
    }

    has(componentName){
        return this.#components.has(componentName);
    }

    get(componentName){
        if (!this.has(componentName)){
            throw new Error('Component not registered, please register first');
        }
        return this.#components.get(componentName).createInstance();
    }

    register(component, componentName = null){
        const name = componentName || component.name;
        try {
            customElements.define(name, component.getComponentClass());
            this.#components.set(name, component);
            console.log(`Component "${name}" registered successfully.`);
            return this;
        } catch (error) {
            throw new Error(`Failed to register component "${name}": ${error.message}`);
        }
    }

    registerAll(components) {
        if (typeof components !== 'object' || components === null) {
            throw new Error('Components must be provided as an object');
        }

        Object.entries(components).forEach(([name, component]) => {
            this.register(component, name);
        });

        return this;
    }

    unregister(componentName) {
        if (!this.has(componentName)) {
            console.warn(`Component "${componentName}" is not registered.`);
            return false;
        }

        this.#components.delete(componentName);
        console.log(`Component "${componentName}" unregistered from service.`);
        return true;
    }

    clear() {
        const count = this.#components.size;
        this.#components.clear();
        console.log(`Cleared ${count} components from registry.`);
        return this;
    }
}
