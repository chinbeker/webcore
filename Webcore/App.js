import Application from "./Application/Application.js";
// import InitialService from "./Initial/InitialService.js";
// import ViewService from "./View/ViewService.js";
// import AuthorizationServce from "./Authorization/AuthorizationServce.js";
// import AuthenticationService from "./Authentication/AuthenticationService.js";
// import LoggingService from "./Logging/LoggingService.js";

console.log("1. 创建应用程序");
const app = Application.createBuilder();

// 添加系统服务
console.log("2. 为应用程序注册服务");
// const singletons = [
    // {name: "initial", service: InitialService},
    // {name: "view", service: ViewService},
    // {name: "authentication", service: AuthenticationService},
    // {name: "authorization", service: AuthorizationServce},
    // {name: "logging", service: LoggingService},
// ];
// for (const singleton of singletons){app.addSingleton(singleton)}


export default app.build();
