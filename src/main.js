import app from "../Webcore/App.js";
import Welcome from "./views/Welcome.js";
// import Dialog from "./components/Dialog.js";

// Configuration 配置
// app.configuration.set('base','http://chinbeker.qicp.vip');
// app.configuration.set('environment','development');

// 组件注册
app.component.register(Welcome);
// app.component.register(Dialog);


// 初始化
app.initial.default = ()=>{console.log('   6.1 默认初始化逻辑')};
app.initial.open = ()=>{console.log('   6.3 自定义初始化逻辑')};
app.initial.loaded= ()=>{console.log('   6.3 DOM元素加载后的初始化逻辑')};



// 启动应用程序
app.run();
self.app = app;

export default app;
