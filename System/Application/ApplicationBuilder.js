import Application from "./Application.js";
import ServiceManager from "/System/Services/ServicesManager.js";
import Configuration from "/System/Configuration/Configuration.js";
import PluginManager from "/System/Plugin/PluginManager.js";
import ReactiveService from "/System/Reactive/ReactiveService.js";
import ComponentService from "/System/Component/ComponentService.js";
import RouterService from "/System/Router/RouterService.js";
import EventService from "/System/Event/EventService.js";
import AuthorizationServce from "/System/Authorization/AuthorizationServce.js";
import AuthenticationService from "/System/Authentication/AuthenticationService.js";
import StorageService from "/System/Storage/StorageService.js";
import StateService from "/System/State/StateService.js";
import CacheService from "/System/Cache/CacheService.js";
import HttpService from "/System/Http/HttpService.js";
import LoggingService from "/System/Logging/LoggingService.js";
import UtilityService from "/System/Utility/UtilityService.js";

export default class ApplicationBuilder {
    #application = null;
    #configuration;
    #services;
    #plugins;
    constructor(){
        this.#application = new Application();
        this.#configuration = new Configuration();
        this.#services = new ServiceManager();
        this.#plugins = new PluginManager();
        this.initialize();
    }

    initialize(){}

    setConfig(key, value) {
        this.#configuration.set(key, value);
        return this;
    }

    addService(name, service) {
        this.#services.register(name, service);
        return this;
    }

    build(){
        this.#application.configuration = this.#configuration;
        this.#application.services = this.#services;
        this.#application.plugins = this.#plugins;
        return this.#application;
    }


    // 添加系统服务
    addReactiveService(){
        this.#services.register('Reactive', ReactiveService, {singleton: true});
        this.#services.resolve('Reactive');
        return this;
    }

    addComponentService(){
        this.#services.register('Component', ComponentService, {singleton: true});
        this.#application.component = this.#services.resolve('Component');
        return this;
    }

    addRouterService(){
        this.#services.register('Router', RouterService, {singleton: true});
        this.#services.resolve('Router');
        return this;
    }

    addEventService(){
        this.#services.register('Event', EventService, {singleton: true});
        this.#services.resolve('Event');
        return this;
    }

    addAuthenticationService(){
        this.#services.register('Authentication', AuthenticationService, {singleton: true});
        this.#services.resolve('Authentication');
        return this;
    }

    addAuthorizationService(){
        this.#services.register('Authorization', AuthorizationServce, {singleton: true});
        this.#services.resolve('Authorization');
        return this;
    }

    addStateService(){
        this.#services.register('State', StateService, {singleton: true});
        this.#services.resolve('State');
        return this;
    }

    addStorageService(){
        this.#services.register('Storage', StorageService, {singleton: true});
        this.#services.resolve('Storage');
        return this;
    }

    addCacheService(){
        this.#services.register('Cache', CacheService, {singleton: true});
        this.#services.resolve('Cache');
        return this;
    }

    addHttpService(){
        this.#services.register('Http', HttpService, {singleton: true});
        this.#services.resolve('Http');
        return this;
    }

    addLoggingService(){
        this.#services.register('Logging', LoggingService, {singleton: true});
        this.#services.resolve('Logging');
        return this;
    }

    addUtilityService(){
        this.#services.register('Utility', UtilityService, {singleton: true});
        this.#services.resolve('Utility');
        return this;
    }

}
