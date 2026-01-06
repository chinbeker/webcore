import Application from "./Application/Application.js";
// import InitialService from "./Initial/InitialService.js";
import RouterService from "./Router/RouterService.js";
import GlobalService from "./Global/GlobalService.js";
import LayoutService from "./Layout/LayoutService.js";
import EventService from "./Event/EventService.js";
import HttpService from "./Http/HttpService.js";
import CacheService from "./Cache/CacheService.js";
import StateService from "./State/StateService.js";
import ReactiveService from "./Reactive/ReactiveService.js";
import StorageService from "./Storage/StorageService.js";
import ComponentService from "./Component/ComponentService.js";
import ViewportService from "./Viewport/ViewportService.js";
import UtilityService from "./Utility/UtilityService.js";
import TextService from "./Text/TextService.js";
import SecurityService from "./Security/SecurityService.js";
// import ViewService from "./View/ViewService.js";
// import AuthorizationServce from "./Authorization/AuthorizationServce.js";
// import AuthenticationService from "./Authentication/AuthenticationService.js";
// import LoggingService from "./Logging/LoggingService.js";

console.log("1. 创建应用程序");
const builder = Application.createBuilder();

// 添加服务配置
console.log("3. 为应用程序注册服务");
const services = [
    {name: "router", service: RouterService, singleton: true, global: true},
    {name: "layout", service: LayoutService, singleton: true, global: true},
    {name: "global", service: GlobalService, singleton: true, global: true},
    {name: "cache", service: CacheService, singleton: false, global: true},
    {name: "event", service: EventService, singleton: true, global: true},
    {name: "http", service: HttpService, singleton: true, dependency: ["cache"]},
    {name: "state", service: StateService, singleton: true, global: true},
    {name: "storage", service: StorageService, singleton: true, global: true},
    {name: "reactive", service: ReactiveService, singleton: true, global: true},
    {name: "component", service: ComponentService, singleton: true, global: true},
    {name: "viewport", service: ViewportService, singleton: true, global: true},
    {name: "utility", service: UtilityService, singleton: true, global: true},
    {name: "text", service: TextService, singleton: true, global: true},
    {name: "security", service: SecurityService, singleton: true, global: true}
];
// 批量注册服务
for (const service of services){ builder.addService(service);}

// 创建应用程序实例
const app = builder.build();

export default app;
