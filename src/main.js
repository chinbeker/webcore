import Application from "/System/Application/Application.js";

const builder = Application.createBuilder();

// 添加系统服务
builder.addLoggingService();
builder.addReactiveService();
builder.addHttpService();
builder.addStateService();
builder.addStorageService();
builder.addCacheService();
builder.addEventService();
builder.addComponentService();
builder.addRouterService();
builder.addAuthenticationService();
builder.addAuthorizationService();
builder.addUtilityService();

// 构建应用程序
const app = builder.build();



// 组件注册
import Welcome from "./components/Welcome.js";
app.component.register(Welcome);



// 启动应用程序
app.run();
self.app = app;

export default app;
