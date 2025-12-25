import Application from "./Application/Application.js";
import InitialService from "./Initial/InitialService.js";
import LayoutService from "./Layout/LayoutService.js";
import ViewportService from "./Viewport/ViewportService.js";
import RouterService from "./Router/RouterService.js";
import ComponentService from "./Component/ComponentService.js";
import ViewService from "./View/ViewService.js";
import EventService from "./Event/EventService.js";
import ReactiveService from "./Reactive/ReactiveService.js";
import HttpService from "./Http/HttpService.js";
import TextService from "./Text/TextService.js";
import GlobalService from "./Global/GlobalService.js";
import StateService from "./State/StateService.js";
// import AuthorizationServce from "./Authorization/AuthorizationServce.js";
// import AuthenticationService from "./Authentication/AuthenticationService.js";
// import StorageService from "./Storage/StorageService.js";
// import CacheService from "./Cache/CacheService.js";
// import LoggingService from "./Logging/LoggingService.js";
// import UtilityService from "./Utility/UtilityService.js";
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
    {name: 'view', service: ViewService},
    {name: 'event', service: EventService},
    {name: 'reactive', service: ReactiveService},
    {name: 'http', service: HttpService},
    {name: 'text', service: TextService},
    {name: 'global', service: GlobalService},
    {name: 'state', service: StateService},
    // {name: 'authentication', service: AuthenticationService},
    // {name: 'authorization', service: AuthorizationServce},
    // {name: 'storage', service: StorageService},
    // {name: 'cache', service: CacheService},
    // {name: 'logging', service: LoggingService},
    // {name: 'utility', service: UtilityService},
    // {name: 'security', service: SecurityService},
    // {name: 'plugin', service: PluginManager},
];

for (const service of singletons){
    app.addSingleton(service.name, service.service)
}

export default app.build();
