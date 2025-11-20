export default class Component {
    name = null;
    componentClass = null;
    template = null;
    styles = null;
    props = [];

    constructor(builder, componentClass){
        this.name = builder.name;
        this.template = builder.template;
        this.styles = builder.styles;
        this.props = builder.props;
        this.componentClass = componentClass;
    }

    createInstance(){
        return new this.componentClass();
    }

    getComponentClass(){
        return this.componentClass;
    }
}
