export default class Component {
    name = null;
    component = null;
    props = null;

    constructor(name, component){
        this.name = name;
        this.props = component.observedAttributes || null;
        this.component = component;
    }

    createInstance(){
        return new this.component();
    }

    getComponentClass(){
        return this.component;
    }
}
