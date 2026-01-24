import Application from "../Application/Application.js";
import ComponentService from "./ComponentService.js";
import ComponentStyles from "./ComponentStyles.js";
import ComponentTemplate from "./ComponentTemplate.js";

export default class ComponentBuilder extends HTMLElement {
    #name = "core-element";
    #mode = "open";
    #inject = [];
    #services = Object.pure();
    #state = Object.pure();
    #root = null;
    #shadow = null;
    #config = null;
    #builder = null;
    #views = null;
    #created = false;
    #render = false;
    #loader = null;

    constructor(){
        super();
        this.#builder = Object.getConstructorOf(this);
        if (Object.hasOwn(this.#builder, "instance")){
            return this.#builder.instance;
        }
        this.#name = this.#builder.tag;
        if (!Object.hasOwn(this.#builder, "template")){this.#builder.template = new ComponentTemplate();}
        if (!Object.hasOwn(this.#builder, "styles")){this.#builder.styles = new ComponentStyles();}

        if (typeof this.create === "function"){this.create()}
        this.#loader = this.#initialize();
        this.#loader.then(root => {this.#build(root)})
    }

    // 访问器
    get root(){return this.#root;}
    get shadow(){return this.#shadow;}
    get services(){return this.#services;}
    get config(){return this.#config;}
    get props(){return this.#builder.observedAttributes || null;}
    get name(){return this.#name;}
    get state(){return this.#state;}
    set state(value){this.#state=value;}


    template(html) {
        if (this.#builder.template.initial === false){
            return this;
        }
        Error.throwIfNotString(html, "Component template");
        if (!String.isNullOrWhiteSpace(html) && !html.includes("<") && !html.includes(">")){
            try {
                const url = new URL(html, ComponentService.instance.base);
                this.#builder.template.url = url;
            } catch  {
                this.#builder.template.html = html;
            }
        } else {
            this.#builder.template.html = html;
        }
        return this;
    }
    styles(styles) {
        if (this.#builder.styles.initial === false){
            return this;
        }
        Error.throwIfNotString(styles, "Component style");
        if (styles.endsWith(".css") || (!styles.includes("{") && !styles.includes("}"))
        ){
            this.#builder.styles.url = new URL(styles, ComponentService.instance.base);
        } else {
            this.#builder.styles.style = styles;
        }
        return this;
    }
    mode(shadowMode = "open") {
        if (!["open", "closed"].includes(shadowMode)) {
            throw new TypeError('Shadow DOM mode must be either "open" or "closed"');
        }
        this.#mode = shadowMode;
        return this;
    }
    inject(service){
        Error.throwIfNotArray(service, "Component service inject");
        this.#inject = service;
        return this;
    }
    configuration(config){
        this.#config = Application.instance.configuration.create(config);
        return this;
    }


    // 声明周期事件
    connectedCallback(){
        if (this.#render && typeof this.onConnected === "function"){return this.onConnected();}
    }
    async attributeChangedCallback(attr, old, value){
        if (this.#created && typeof this.onAttributeChanged === "function"){
            if (this.#render){
                return this.onAttributeChanged(attr, value, old);
            } else {
                await this.#loader;
                return this.onAttributeChanged(attr, value, old);
            }
        }
    }
    adoptedCallback(){
        if (typeof this.onAdopted === "function"){return this.onAdopted();}
    }
    disconnectedCallback(){
        if (typeof this.onDisconnected === "function"){return this.onDisconnected();}
    }

    // 路由接口
    async routeCallback(name){
        if (this.#render === true){
            if (this.#views !== null){
                const view = this.#views.get(name);
                if (view){
                    view.clear();
                    return view;
                }
            }
            return null;
        } else {
            await this.#loader;
            if (this.#views === null){return null;}
            return this.#views.get(name);
        }
    }
    async beforeRouteCallback(route){
        if (typeof this.onBeforeRoute !== "function"){return true;}
        if (this.#render === true){
            return this.onBeforeRoute(route);
        } else {
            await this.#loader;
            return this.onBeforeRoute(route);
        }
    }


    // 公共方法
    selector(selector){return this.#root.querySelector(selector)}
    service(name) {return Object.hasOwn(this.#services, name) ? this.#services[name] : null;}

    // 私有方法
    async #initialize(){
        this.#shadow = this.attachShadow({ mode: this.#mode });
        this.#created = true;

        // 加载样式
        if (!this.#builder.styles.initial){
            const styleSheet = await this.#builder.styles.styleSheet();
            this.#shadow.adoptedStyleSheets = styleSheet;
        }

        // 加载 HTML
        this.#root = await this.#builder.template.fragment();

        // 解析服务
        if (this.#inject.length > 0){
            this.#services = Application.instance.resolve(this.#inject);
        }

        // 获取 router-view
        const views = this.#root.querySelectorAll("router-view");
        if (views.length > 0){
            this.#views = new Map();
            for (let i = 0;i < views.length;i ++){
                const name = views[i].hasAttribute("name") ? views[i].getAttribute("name") : "default";
                this.#views.set(name, views[i])
            }
        }

        // 执行组件初始化代码
        if (typeof this.onCreated === "function"){this.onCreated()}
        this.#render = true;
        return this.#root;
    }

    // 执行组件逻辑后的挂载方法
    #build(root){
        // 挂载前钩子
        if (typeof this.onBeforeMount === "function"){this.onBeforeMount()}

        this.#loader = null;
        const element = root.querySelector(".root");
        if (element) {this.#root = element} else {this.#root = root.firstElementChild;}
        this.#root.classList.add("root");
        Application?.instance?.router?.bind(root);
        this.#shadow.appendChild(root);

        // 首次挂载后钩子
        if (typeof this.onMounted === "function"){this.onMounted();}
    }

    static check(name){
        name = String.toNotEmptyString(name, "Component tag name");
        if (!name.includes("-")){name = `core-${name}`;}
        return name;
    }
}
