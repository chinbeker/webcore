import Application from "./Application.js";
import ServiceManager from "/System/Services/ServicesManager.js";
import Configuration from "/System/Configuration/Configuration.js";
import PluginManager from "/System/Plugin/PluginManager.js";
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
    Configuration;
    Services;
    Plugins;
    constructor(){
        this.Configuration = new Configuration();
        this.Services = new ServiceManager();
        this.Plugins = new PluginManager();
        this.initialize();
    }

    initialize(){}

    setConfig(key, value) {
        this.Configuration.set(key, value);
        return this;
    }

    addService(name, service) {
        this.Services.Register(name, service);
        return this;
    }

    build(){
        return new Application(this.Configuration, this.Services, this.Plugins)
    }


    // 添加系统服务
    addComponentService(){
        this.Services.Register('Component', ComponentService, {singleton: true});
        this.Services.Resolve('Component');
        return this;
    }

    addRouterService(){
        this.Services.Register('Router', RouterService, {singleton: true});
        this.Services.Resolve('Router');
        return this;
    }

    addEventService(){
        this.Services.Register('Event', EventService, {singleton: true});
        this.Services.Resolve('Event');
        return this;
    }

    addAuthenticationService(){
        this.Services.Register('Authentication', AuthenticationService, {singleton: true});
        this.Services.Resolve('Authentication');
        return this;
    }

    addAuthorizationService(){
        this.Services.Register('Authorization', AuthorizationServce, {singleton: true});
        this.Services.Resolve('Authorization');
        return this;
    }

    addStateService(){
        this.Services.Register('State', StateService, {singleton: true});
        this.Services.Resolve('State');
        return this;
    }

    addStorageService(){
        this.Services.Register('Storage', StorageService, {singleton: true});
        this.Services.Resolve('Storage');
        return this;
    }

    addCacheService(){
        this.Services.Register('Cache', CacheService, {singleton: true});
        this.Services.Resolve('Cache');
        return this;
    }

    addHttpService(){
        this.Services.Register('Http', HttpService, {singleton: true});
        this.Services.Resolve('Http');
        return this;
    }

    addLoggingService(){
        this.Services.Register('Logging', LoggingService, {singleton: true});
        this.Services.Resolve('Logging');
        return this;
    }

    addUtilityService(){
        this.Services.Register('Utility', UtilityService, {singleton: true});
        this.Services.Resolve('Utility');
        return this;
    }

}
