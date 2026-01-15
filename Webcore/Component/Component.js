export default class Component {

    constructor(name, component){
        this.name = name;
        this.props = component.observedAttributes || null;
        this.component = component;
        Object.sealProp(component, "routing", false);
    }

    createInstance(){
        return new this.component();
    }

    getComponentClass(){
        return this.component;
    }
}
