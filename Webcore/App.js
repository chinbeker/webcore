import Application from "./Application/Application.js";
import InitialService from "./Initial/InitialService.js";
import LayoutService from "./Layout/LayoutService.js";
import ViewportService from "./Viewport/ViewportService.js";
import RouterService from "./Router/RouterService.js";
import ComponentService from "./Component/ComponentService.js";
import ReactiveService from "./Reactive/ReactiveService.js";
import EventService from "./Event/EventService.js";
// import AuthorizationServce from "./Authorization/AuthorizationServce.js";
// import AuthenticationService from "./Authentication/AuthenticationService.js";
// import StorageService from "./Storage/StorageService.js";
// import StateService from "./State/StateService.js";
// import CacheService from "./Cache/CacheService.js";
// import HttpService from "./Http/HttpService.js";
// import LoggingService from "./Logging/LoggingService.js";
// import UtilityService from "./Utility/UtilityService.js";
// import TextService from "./Text/TextService.js";
// import SecurityService from "./Security/SecurityService.js";
// import PluginManager from "./Plugin/PluginManager.js";

console.log('1. 创建应用程序');
const app = Application.createBuilder();

// 添加系统服务
console.log('2. 为应用程序注册服务');
const singletons = [
    {name: 'initial', service: InitialService},
    {name: 'layout', service: LayoutService},
    {name: 'viewport', service: ViewportService},
    {name: 'router', service: RouterService},
    {name: 'component', service: ComponentService},
    {name: 'reactive', service: ReactiveService},
    {name: 'event', service: EventService},
    // {name: 'authentication', service: AuthenticationService},
    // {name: 'authorization', service: AuthorizationServce},
    // {name: 'state', service: StateService},
    // {name: 'storage', service: StorageService},
    // {name: 'cache', service: CacheService},
    // {name: 'http', service: HttpService},
    // {name: 'logging', service: LoggingService},
    // {name: 'utility', service: UtilityService},
    // {name: 'text', service: TextService},
    // {name: 'security', service: SecurityService},
    // {name: 'plugin', service: PluginManager},
];

for (const service of singletons){
    app.addService(service.name, service.service, {singleton: true})
}

export default app.build();
