import Application from "/System/Application.js";

const builder = Application.createBuilder();

// 启动系统服务
builder.addLoggingService();
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


// 注册自定义服务





// 启动应用程序
const app = builder.build();

app.run();



export default app;
