import ApplicationBuilder from "./ApplicationBuilder.js";

export default class Application {
    static Instance = null;
    Configuration = null;
    Services = null;
    Plugins = null;

    constructor(configuration, services, plugins ){
        if (Application.Instance) {
            return Application.Instance;
        }
        this.Configuration = configuration;
        this.Services = services;
        this.Plugins = plugins;
        Application.Instance = this;

    }

    static createBuilder(){
        return new ApplicationBuilder();
    }

    getConfig(key) {
        return this.Configuration.get(key);
    }

    getService(name) {
        return this.Services.resolve(name);
    }

    // 检查服务是否存在
    hasService(name) {
        return this.Services.has(name);
    }

    // 获取所有已注册的服务名称
    getRegisteredServices(){
        return this.Services.getRegisteredServices();
    }


    run(){
        console.log('应用程序已启动');
    }
}
