import ApplicationBuilder from "/System/Application/ApplicationBuilder.js";

export default class Application {
    static #instance = null;
    configuration = null;
    component = null;
    services = null;
    plugins = null;

    constructor(){
        if (Application.#instance) {
            return Application.#instance;
        }
        Application.#instance = this;
    }

    static createBuilder(){
        return new ApplicationBuilder();
    }

    getConfig(key) {
        return this.configuration.get(key);
    }

    getService(name) {
        return this.services.resolve(name);
    }

    // 检查服务是否存在
    hasService(name) {
        return this.services.has(name);
    }

    // 获取所有已注册的服务名称
    getRegisteredServices(){
        return this.services.getRegisteredServices();
    }


    run(){
        console.log('应用程序已启动');
    }
}
