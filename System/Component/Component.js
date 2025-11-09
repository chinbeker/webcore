import ServicesManager from "/System/Services/ServicesManager.js";
import Configuration from "/System/Configuration/Configuration.js";

export default class Component {
    builder = null;
    template = null;
    styles = null;
    configuration = null;
    services = null;

    constructor(){
        this.configuration = new Configuration();
        this.services = new ServicesManager();
    }


    template(componentTemplate = '<div></div>'){
        this.template = componentTemplate;
        return this;
    }

    styles(componentStyles = null){
        this.styles = componentStyles;
        return this;
    }


    build(){
        return new this.builder();
    }
}
