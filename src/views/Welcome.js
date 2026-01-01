import app from "/Webcore/App.js";

export default class Welcome extends app.component.builder {
    static tag = 'welcome';                                                // 组件标签名称（如果省略前缀，会自动添加core-前缀，最终标签名为 core-welcome ）
    static get observedAttributes() {return ['content'];}                  // 设置要监听元素的哪些属性（这是原生API，格式不能变）

    constructor(){
        super();

        // 自己写的逻辑，在这里依次调用。（这个没有框架约定或限制了，自己随意发挥了）
        this.init();
        this.hook();
    }

    // 这是组件的第一步，必须使用 create 方法，设置模板或样式等。（这也是唯一一个固定使用方法。其他的自由发挥）
    create(){
        this.template(
            `<div>
                <h1><span>Welcome</span></h1>
            </div>`
        )                                                                   // 设置初始模板
        // .styles(
        //     `h1 {
        //         font-size: 5em;
        //         line-height: 5em;
        //         text-align: center;
        //         color: red;
        //     }`
        // )                                                                // 直接设置样式
        .styles('/src/styles/Welcome.css')                                  // 通过 url 加载样式
        .inject(['reactive', 'event', 'cache', 'http']);         // 依赖服务注入
    }

    // 这个自己写的组件逻辑
    init(){}
    hook(){
        // 使用服务
        // const reactive = this.service('reactive');    // 获取单个服务（必须先依赖服务注入）
        // const event = this.service('event');

        const {reactive, event, cache, http} = this.services;     // 解构批量获取服务（必须先依赖服务注入）

        // 使用 http 服务创建请求客户端
        const api = http.create({
            url: '/src/styles/Welcome.css',
            // baseUrl: '',
            cache: 10                                               // 缓存 10 秒
        });
        // api.get().then();
        // api.get().post();

        // 保存 api 后可重复使用
        http.set("welcome", api);


        // 选择或创建组件DOM元素，变为数据响应式元素( reactive.element() 会把 DOM 元素变成响应式，修改 .value 会自动更新页面内容)
        const content = reactive.element(this.selector('span'));
        content.onchange = (value, oldvalue, element)=>{
            console.log("页面变化前的额外回调:", element, "新值：",value, "; 旧值：", oldvalue);
        };

        // 保存到状态数据容器
        this.state.content = content;

        // 添加缓存数据（滑动过期10秒钟）
        cache.set('data', '123456789', {sliding: 10 },                      // 直接使用缓存，是全局缓存。
            ()=>{console.log('data 缓存已过期')}  // 过期回调函数
        );

        // 向 localStorage 添加数据 ( storage 是全局服务，可直接使用)
        app.storage.set('token','FJOSJAFOIWJEFKLAFOIWJE3543OIJTJF9834JFI');

        // 给元素绑定事件
        event.select(content)   // 使用 event 服务的 select 方法，选择要绑定事件的DOM元素
        .click(                 // 可以链式调用，绑定多个事件
            ()=>{content.value = 'Hello World'}
        ).bind();               // 调用 .bind() 生效

        // 主动暴露组件方法，让其他组件调用
        event.expose('welcome', {
            open(){console.log('156156')}
        })

        console.dir(this);
    }

    // 声明周期管理
    // 组件挂载时
    onConnected(){console.log("组件已经挂载到页面")}

    onAttributeChanged(attr, value, old){
        console.log(`组件属性监听：组件 'my-welcome' 的 ${attr} 属性值发生改变: ${old} -> ${value}`);
        if (attr === "content"){this.state.content.value = value;}                             // 监听到属性值变化，就可以改变内容了
    }

    // 组件卸载时
    onDisconnected(){
        console.log("组件从页面中卸载");
        // 组件卸载时要做的回收工作
        this.services.event.delete('welcome');
    }
}
