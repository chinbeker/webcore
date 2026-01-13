export default class Component {
    keepAlive = false;

    constructor(name, component){
        this.name = name;
        this.props = component.observedAttributes || null;
        this.component = component;
        if (Object.hasOwn(component,"keepAlive")){
            this.keepAlive = component.keepAlive;
        } else {
             component.keepAlive = false;
        }

    }

    createInstance(){
        return new this.component();
    }

    getComponentClass(){
        return this.component;
    }
}
