// const webcore = window.webcore;
import webcore from "../Webcore/App.js";
import router from "./router/index.js"

// Configuration 配置
// app.configuration.set('base','http://localhost/');

// 添加路由表
webcore.router.use(router);

// 初始化
webcore.initial.open = ()=>{console.log('   8.1 自定义初始化逻辑')};
webcore.initial.loaded = ()=>{console.log('   8.2 DOM元素加载后的初始化逻辑')};


// 启动应用程序
webcore.run();
