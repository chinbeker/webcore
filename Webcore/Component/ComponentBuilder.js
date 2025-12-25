import app from "/Webcore/App.js";

class ComponentTemplate {
    #initial = true;
    #fragment = null;
    #html = '<div><slot></slot></div>';

    get initial(){return this.#initial;}
    get html(){return this.#html;}

    set html(value){
        if (this.#initial && typeof value === 'string' && value.length > 3){
            this.#html = ComponentTemplate.compress(value);
            this.#initial = false;
        }
    }

    has(){return (typeof this.#html === 'string' && this.#html.length > 3)}

    fragment(clone = false){
        if (this.#fragment == null){
            this.#fragment = document.createRange().createContextualFragment(this.#html);
        }
        if (clone === true){
            return this.#fragment.firstElementChild.cloneNode(true);
        } else {
            return this.#fragment.firstElementChild;
        }
    }

    static compress(html){return html.replace(/\n\s*/g, '').replace(/>\s+</g, '><').trim()}
}

class ComponentStyles {
    #href = null;
    #style = null;
    #initial = true;
    #loaded = false;
    #styleSheet = null;

    get initial(){return this.#initial;}
    get href(){return this.#href;}
    get style(){return this.#style;}

    set style(value){
        if (this.#initial){
            if (value.endsWith('.css')){
                this.#href = value;
                this.#initial = false;
            } else if (value.length > 3) {
                this.#style = ComponentStyles.compress(value);
                this.#initial = false;
            }
        }
    }

    async getStyleSheet(){
        if (this.#href !== null && !this.#loaded){
            try {
                const style = await app.loader(this.#href);
                this.#style = ComponentStyles.compress(style);
                this.#loaded = true;
            } catch (error) {
                throw new TypeError('Component style loading failed. ', error);
            }
        }
        if (!this.#initial && this.#styleSheet == null){
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(this.#style);
            this.#styleSheet = [sheet];
        }
        return this.#styleSheet;
    }

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
    #config = null;
    #component = null;

    static check(name){
        if (typeof name !== 'string'){return null;}
        if (name && !name.includes('-')){name = `core-${name}`;}
        return name;
    }

    constructor(config=null){
        super();
        this.#component = Object.getPrototypeOf(this).constructor;
        this.#name = this.#component.tag;
        if (Object.isObject(config)){this.#config = app.configuration.create(config);}
        if (!Object.hasOwn(this.#component, 'template')){this.#component.template = new ComponentTemplate();}
        if (!Object.hasOwn(this.#component, 'styles')){this.#component.styles = new ComponentStyles();}
        Object.freeze(this.#component);
        this.create();
        this.#create();
        this.#build();
    }

    // 访问器
    get root(){return this.#root;}
    get shadow(){return this.#shadow;}
    get services(){return this.#services;}
    get element(){return this.#element;}
    get config(){return this.#config;}
    get state(){return this.#state;}
    get props(){return Object.getPrototypeOf(this).constructor.observedAttributes || null;}
    get tag(){return Object.getPrototypeOf(this).constructor.tag;}


    template(html) {
        if (typeof html !== 'string'){console.error('The component template must be of string type.');}
        this.#component.template.html = html;
        return this;
    }

    styles(styles) {
        if (typeof styles !== 'string'){console.error('The component style must be of string type.');}
        this.#component.styles.style = styles;
        return this;
    }

    mode(shadowMode = 'open') {
        if (!['open', 'closed'].includes(shadowMode)) {
            throw new TypeError('Shadow DOM mode must be either "open" or "closed"');
        }
        this.#mode = shadowMode;
        return this;
    }

    inject(service){
        if (!Array.isArray(service)){throw new TypeError('Component service inject must be a array value')}
        this.#inject = service;
        return this;
    }

    // 声明周期事件
    connectedCallback(){if (typeof this.onConnected === 'function'){return this.onConnected();}}
    attributeChangedCallback(name, old, value){if (typeof this.onAttributeChanged === 'function'){return this.onAttributeChanged(name, old, value);}}
    adoptedCallback(){if (typeof this.onAdopted === 'function'){return this.onAdopted();}}
    disconnectedCallback(){if (typeof this.onDisconnected === 'function'){return this.onDisconnected();}}

    // 公共方法
    selector(selector){return this.#root.querySelector(selector)}
    service(name) {return Object.hasOwn(this.#services, name) ? this.#services[name] : null;}


    // 构造方法
    create(func){if (typeof func !== 'function'){throw new TypeError('"create" method must be implemented by subclass')}return this;}
    render(func){if (typeof func !== 'function'){throw new TypeError('"render" method must be implemented by subclass')}return this;}

    #create(){
        this.#shadow = this.attachShadow({ mode: this.#mode });
        if (this.#component.template.has()) {
            this.#root = this.#component.template.fragment(true);
        }
        if (this.#inject.length > 0){
            this.#services = Object.create(null);
            for (const service of this.#inject){
                this.#services[service] = app.services.get(service);
            }
        }

    }

    async #build(){
        if (!this.#component.styles.initial){
            const styleSheet = await this.#component.styles.getStyleSheet();
            this.#shadow.adoptedStyleSheets = styleSheet;
        }
        this.#shadow.appendChild(this.#root);
    }
}
