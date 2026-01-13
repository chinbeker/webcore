import ComponentStyles from "./ComponentStyles.js";
import ComponentTemplate from "./ComponentTemplate.js";

export default class ComponentBuilder extends HTMLElement {
    #name = "core-element";
    #mode = "open";
    #inject = [];
    #services = Object.pure();
    #state = Object.pure();
    #element = Object.pure();
    #root = null;
    #shadow = null;
    #config = null;
    #builder = null;
    #route = null;
    #views = null;
    #created = false;

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

        if (this.#builder.router !== true){
            this.#create().then(root => {
                if (typeof this.init === "function"){this.init();}
                this.#build(root)
            })
        }

    }

    // 访问器
    get root(){return this.#root;}
    get shadow(){return this.#shadow;}
    get services(){return this.#services;}
    get element(){return this.#element;}
    get config(){return this.#config;}
    get state(){return this.#state;}
    get props(){return this.#builder.observedAttributes || null;}
    get name(){return this.#name;}


    loadTemplate(url){
        this.#builder.template.href = url;
        return this;
    }
    loadStyles(url){
        this.#builder.styles.href = url;
        return this;
    }
    template(html) {
        if (typeof html !== "string"){console.error("Component template must be of string type.");}
        this.#builder.template.html = html;
        return this;
    }
    styles(styles) {
        if (typeof styles !== "string"){console.error("Component style must be of string type.");}
        this.#builder.styles.style = styles;
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
        this.#config = webcore.configuration.create(config);
        return this;
    }


    // 声明周期事件
    async connectedCallback(){
        if (typeof this.onConnected === "function"){return this.onConnected();}
    }
    attributeChangedCallback(attr, old, value){
        if (typeof this.onAttributeChanged === "function"){return this.onAttributeChanged(attr, value, old);}
    }
    adoptedCallback(){
        if (typeof this.onAdopted === "function"){return this.onAdopted();}
    }
    disconnectedCallback(){
        if (typeof this.onDisconnected === "function"){return this.onDisconnected();}
    }
    async routeCallback(route){
        this.#route = route;
        if (this.#created === true){
            if (typeof this.onRoute === "function"){
                this.onRouteChange(this.#route)
            }
            const view = this.#views.get(route.view);
            if (view){view.clear();return view;}
            return null;
        }
        const root = await this.#create();
        if (typeof this.init === "function"){this.init()}
        this.#views = new Map();
        const views = root.querySelectorAll("router-view");
        if (views.length > 0){
            for (let i = 0;i < views.length;i ++){
                const name = views[i].hasAttribute("name") ? views[i].getAttribute("name") : "default";
                this.#views.set(name, views[i])
            }
        }
        if (typeof this.onRoute === "function"){
            this.onRouteChange(this.#route);
        }
        this.#build(root);
        return this.#views.get(route.view);
    }

    // 公共方法
    selector(selector){return this.#root.querySelector(selector)}
    service(name) {return Object.hasOwn(this.#services, name) ? this.#services[name] : null;}

    // 私有方法
    async #create(){
        this.#shadow = this.attachShadow({ mode: this.#mode });
        this.#created = true;
        // 加载 HTML
        if (this.#builder.template.has()) {
            this.#root = await this.#builder.template.fragment();
        }
        // 加载样式
        if (!this.#builder.styles.initial){
            const styleSheet = await this.#builder.styles.styleSheet();
            this.#shadow.adoptedStyleSheets = styleSheet;
        }
        // 解析服务
        if (this.#inject.length > 0){
            this.#services = Object.pure();
            for (const service of this.#inject){
                this.#services[service] = webcore.getService(service);
            }
        }
        return this.#root;
    }
    // 执行组件逻辑后的挂载方法
    async #build(root){
        const element = root.querySelector(".root");
        if (element) {this.#root = element} else {this.#root = root.firstElementChild;}
        top.webcore.router.bind(this.root);
        this.#shadow.appendChild(root);
    }

    static check(name){
        name = String.toNotEmptyString(name, "Component tag name");
        if (!name.includes("-")){name = `core-${name}`;}
        return name;
    }
}
