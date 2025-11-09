import Component from "./Component.js";
import ComponentBuilder from "./ComponentBuilder.js";

export default class ComponentService {
    static Instance = null;
    #components = new Map();

    constructor(){
        if (ComponentService.Instance) {
            return ComponentService.Instance;
        }
        ComponentService.Instance = this;
    }

    static createBuilder(){
        return new ComponentBuilder();
    }

    has(componentName){
        return this.#components.has(componentName);
    }

    get(componentName){
        if (!this.has(componentName)){throw new Error('组件未注册，请先注册');}
        return this.#components.get(componentName);
    }

    register(componentName, componentClass){
        customElements.define(componentName, componentClass);
        const component = new Component();
        component.builder = componentClass;
        this.#components.set(componentName, component);
        return this;
    }

}
