import App from "../App.js";

class ComponentTemplate {
    #fragment = null;
    #html = '<div><slot></slot></div>';

    set html(value){
        if (value && typeof value === 'string'){this.#html = value;}
    }
    get html(){return this.#html;}
    get fragment(){
        if (this.#fragment === null){this.#create()}
        return this.#fragment;
    }
    get fragmentClone(){
        if (this.#fragment === null){this.#create()}
        return this.#fragment.cloneNode(true);
    }
    has(){return (typeof this.#html === 'string' && this.#html.length>3)}
    #create(){this.#fragment = document.createRange().createContextualFragment(this.#html)}
    static compress(html){return html.replace(/\n\s*/g, '').replace(/>\s+</g, '><').trim()}
}

class ComponentStyles {
    #styleSheet = null;
    #style = null;

    set style(value){if (value && typeof value === 'string'){this.#style = value;}}
    get style(){return this.#style}
    get styleSheet(){
        if (this.#styleSheet === null){
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(this.#style);
            this.#styleSheet = [sheet];
        }
        return this.#styleSheet;
    }
    has(){return this.#style !== null}
    static compress(style){
        return style.replace(/\n\s*/g, '')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/;\s*}/g, '}')
        .trim();
    }
}



export default class ComponentBuilder extends HTMLElement {
    #name = 'core-element';
    #mode = 'open';
    #inject = [];
    #services = Object.create(null);
    #state = Object.create(null);
    #element = Object.create(null);
    #root = null;
    #shadow = null;
    #component = null;

    static check(name){
        if (typeof name !== 'string'){return null;}
        if (name && !name.includes('-')){name = `core-${name}`;}
        return name;
    }

    constructor(component){
        super();
        this.create();
        this.build();
    }

    // 访问器
    get root(){return this.#root;}
    get shadow(){return this.#shadow;}
    get services(){return this.#services;}
    get element(){return this.#element;}
    get state(){return this.#state;}
    get props(){return Object.getPrototypeOf(this).constructor.observedAttributes;}
    get tagName(){return Object.getPrototypeOf(this).constructor.tagName;}


    template(html) {
        if (typeof html === 'string'){
            if (this.#component === null){
                this.#component = Object.getPrototypeOf(this).constructor;
            }
            if (!Object.hasOwn(this.#component, 'template')){
                this.#component.template = new ComponentTemplate();
                if (!html){html = '<div><slot></slot></div>'}
                this.#component.template.html = ComponentTemplate.compress(html);
            }
        }
        return this;
    }

    styles(styles) {
        if (typeof styles === 'string'){
            if (styles){
                if (this.#component === null){
                    this.#component = Object.getPrototypeOf(this).constructor;
                }
                if (!Object.hasOwn(this.#component, 'styles')){
                    this.#component.styles = new ComponentStyles();
                    this.#component.styles.style = ComponentStyles.compress(styles);
                }
            }
        }
        return this;
    }

    mode(shadowMode = 'open') {
        if (!['open', 'closed'].includes(shadowMode)) {
            throw new Error('Shadow DOM mode must be either "open" or "closed"');
        }
        this.#mode = shadowMode;
        return this;
    }

    inject(...service){
        if (!Array.isArray(service)){throw new Error('Component service inject must be a array value')}
        this.#inject.push(...service);
        return this;
    }

    // 声明周期事件
    connectedCallback(){if (typeof this.onConnected === 'function'){return this.onConnected();}}
    attributeChangedCallback(name, old, value){if (typeof this.onAttributeChanged === 'function'){return this.onAttributeChanged(name, old, value);}}
    adoptedCallback(){if (typeof this.onAdopted === 'function'){return this.onAdopted();}}
    disconnectedCallback(){if (typeof this.onDisconnected === 'function'){return this.onDisconnected();}}

    // 公共方法
    selector(selector){return this.#shadow.querySelector(selector)}
    service(name) {return Object.hasOwn(this.#services, name) ? this.#services[name] : null;}


    // 构造方法
    create(func){if (typeof func !== 'function'){throw new Error('"create" method must be implemented by subclass')}return this;}
    render(func){if (typeof func !== 'function'){throw new Error('"render" method must be implemented by subclass')}return this;}
    build(){
        const shadow = this.attachShadow({ mode: this.#mode });
        if (Object.hasOwn(this.#component, 'styles') && this.#component.styles.has()){
            shadow.adoptedStyleSheets = this.#component.styles.styleSheet;
        }
        if (!Object.hasOwn(this.#component, 'template')){throw new Error('Component template is invalid.');}
        if (this.#component.template.has()) {this.#root = this.#component.template.fragmentClone}
        shadow.appendChild(this.#root);
        this.#shadow = shadow;
        this.#root = shadow.firstElementChild;
        if (this.#inject.length > 0){
            this.#services = Object.create(null);
            for (const service of this.#inject){
                this.#services[service] = App.services.get(service)
            }
        }
    }
}
