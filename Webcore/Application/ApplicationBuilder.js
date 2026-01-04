import FrameworkCore from "../Framework/FrameworkCore.js";
import Application from "./Application.js";
import ServiceManager from "../Services/ServicesManager.js";
// import PluginManager from "../Plugin/PluginManager.js";
import Configuration from "../Configuration/Configuration.js";
import RouterService from "../Router/RouterService.js";
import GlobalService from "../Global/GlobalService.js";
import LayoutService from "../Layout/LayoutService.js";
import EventService from "../Event/EventService.js";
import HttpService from "../Http/HttpService.js";
import CacheService from "../Cache/CacheService.js";
import StateService from "../State/StateService.js";
import ReactiveService from "../Reactive/ReactiveService.js";
import StorageService from "../Storage/StorageService.js";
import ComponentService from "../Component/ComponentService.js";
import ViewportService from "../Viewport/ViewportService.js";
import UtilityService from "../Utility/UtilityService.js";
import TextService from "../Text/TextService.js";
import SecurityService from "../Security/SecurityService.js";

export default class ApplicationBuilder {
    static #instance = null;
    #application = null;
    #configuration;
    #serviceManager;
    #pluginManager;
    #registry = [];

    constructor(){
        if (ApplicationBuilder.#instance) {
            return ApplicationBuilder.#instance;
        }
        new FrameworkCore();
        this.#initialization();
        ApplicationBuilder.#instance = this;
    }
    #initialization(){

        // 创建服务容器对象
        this.#serviceManager = new ServiceManager();
        // 创建系统配置对象
        this.#configuration = new Configuration();

        // 系统初始配置
        this.#configuration.set("base", location.origin);
        this.#configuration.set("environment", window.isSecureContext && location.protocol === "http:" ? "development": "production");
    }

    setConfig(key, value) {
        this.#configuration.set(key, value);
        return this;
    }

    addSingleton(name, service, deps){
        this.#serviceManager.addSingleton(name, service, deps);
        this.#registry.push(name);
        return this;
    }

    addTransient(name, service, deps) {
        this.#serviceManager.addTransient(name, service, deps);
        this.#registry.push(name);
        return this;
    }

    build(){
        console.log("3. 各项服务启动");
        const application = new Application(this.#configuration, this.#serviceManager, this.#pluginManager);
        // 缓存不是单例服务（单独注册）
        this.#serviceManager.addTransient("cache", CacheService);
        Object.freezeProp(application, "cache", new CacheService());
        // 批量注册单例服务
        const services = [
            {name: "router", service: RouterService},
            {name: "layout", service: LayoutService},
            {name: "global", service: GlobalService},
            {name: "event", service: EventService},
            {name: "http", service: HttpService, deps: ["cache"]},
            {name: "state", service: StateService},
            {name: "storage", service: StorageService},
            {name: "reactive", service: ReactiveService},
            {name: "component", service: ComponentService},
            {name: "viewport", service: ViewportService},
            {name: "utility", service: UtilityService},
            {name: "text", service: TextService},
            {name: "security", service: SecurityService}
        ];
        for (const service of services){
            this.#serviceManager.addSingleton(service.name, service.service, service.deps);
            Object.freezeProp(application, service.name, this.#serviceManager.get(service.name));
        }
        Object.freeze(application);
        return application;
    }
}
