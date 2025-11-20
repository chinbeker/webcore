import ApplicationBuilder from "./ApplicationBuilder.js";


export default class Application {
    static #instance = null;
    configuration = null;
    services = null;

    constructor(configuration, services){
        if (Application.#instance) {
            return Application.#instance;
        }
        this.configuration = configuration;
        this.services = services;
        Application.#instance = this;
    }

    static createBuilder(){return new ApplicationBuilder();}
    getConfig(key) {return this.configuration.get(key);}
    getService(name) {return this.services.resolve(name);}
    hasService(name) {return this.services.has(name);}

    // 获取所有已注册的服务名称
    getRegisteredServices(){return this.services.getRegisteredServices();}


    run(){
        console.log('5. 应用程序启动中……');
        if (Object.hasOwn(this, 'initial')){this.initial.execute();}
        console.log('7. 应用程序启动完成');
    }
}
