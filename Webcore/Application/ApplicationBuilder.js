import Application from "./Application.js";
import ServiceManager from "../Services/ServicesManager.js";
import Configuration from "../Configuration/Configuration.js";

export default class ApplicationBuilder {
    #application = null;
    #configuration;
    #serviceManager;
    #pluginManager;
    #services = [];

    constructor(){
        this.#configuration = new Configuration();
        this.#serviceManager = new ServiceManager();
    }

    setConfig(key, value) {
        this.#configuration.set(key, value);
        return this;
    }

    addService(name, service, options = {}) {
        this.#serviceManager.register(name, service, options);
        this.#services.push(name);
        return this;
    }

    build(){
        console.log('3. 各项服务启动');
        const application = new Application(this.#configuration, this.#serviceManager, this.#pluginManager);
        for (const name of this.#services){
            application[name] = (this.#serviceManager.get(name));
        }
        return application;
    }
}
