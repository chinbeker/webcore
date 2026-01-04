import app from "/Webcore/App.js";

class ComponentTemplate {
    #initial = true;
    #fragment = null;
    #html = "<slot></slot>";

    get initial(){return this.#initial;}
    get html(){return this.#html;}

    set html(value){
        if (this.#initial && !String.isNullOrWhiteSpace(value)){
            this.#html = ComponentTemplate.compress(value);
            this.#initial = false;
        }
    }

    has(){return !String.isNullOrWhiteSpace(this.#html);}

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

    static compress(html){return html.replace(/\n\s*/g, "").replace(/>\s+</g, "><").trim()}
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
            if (value.endsWith(".css")){
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
            } catch  {
                throw new TypeError("Component style loading failed.");
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
        return style.replace(/\n\s*/g, "")
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*;\s*/g, ";")
        .replace(/;\s*}/g, "}")
        .trim();
    }
}



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

    constructor(config=null){
        super();
        this.#builder = Object.getConstructorOf(this);
        this.#name = this.#builder.tag;
        if (!Object.hasOwn(this.#builder, "template")){this.#builder.template = new ComponentTemplate();}
        if (!Object.hasOwn(this.#builder, "styles")){this.#builder.styles = new ComponentStyles();}
        if (Object.isObject(config)){this.#config = app.configuration.create(config);}
        Object.freeze(this.#builder);
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
    get props(){return this.#builder.observedAttributes || null;}
    get name(){return this.#name;}


    template(html) {
        if (typeof html !== "string"){console.error("Component template must be of string type.");}
        this.#builder.template.html = html;
        return this;
    }

    styles(styles) {
        if (typeof styles !== "string"){console.error("Component style must be of string type.");}
        // if ()
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

    // 声明周期事件
    connectedCallback(){if (typeof this.onConnected === "function"){return this.onConnected();}}
    attributeChangedCallback(attr, old, value){if (typeof this.onAttributeChanged === "function"){return this.onAttributeChanged(attr, value, old);}}
    adoptedCallback(){if (typeof this.onAdopted === "function"){return this.onAdopted();}}
    disconnectedCallback(){if (typeof this.onDisconnected === "function"){return this.onDisconnected();}}

    // 公共方法
    selector(selector){return this.#root.querySelector(selector)}
    service(name) {return Object.hasOwn(this.#services, name) ? this.#services[name] : null;}


    // 抽象方法
    create(func){if (typeof func !== "function"){throw new TypeError('"create" method must be implemented by subclass')}return this;}
    render(func){if (typeof func !== "function"){throw new TypeError('"render" method must be implemented by subclass')}return this;}

    // 私有方法
    #create(){
        this.#shadow = this.attachShadow({ mode: this.#mode });
        if (this.#builder.template.has()) {
            this.#root = this.#builder.template.fragment(true);
        }
        if (this.#inject.length > 0){
            this.#services = Object.pure();
            for (const service of this.#inject){
                this.#services[service] = app.getService(service);
            }
        }

    }
    async #build(){
        if (!this.#builder.styles.initial){
            const styleSheet = await this.#builder.styles.getStyleSheet();
            this.#shadow.adoptedStyleSheets = styleSheet;
        }
        this.#shadow.appendChild(this.#root);
    }

    static check(name){
        name = String.toNotEmptyString(name, "Component tag name");
        if (!name.includes("-")){name = `core-${name}`;}
        return name;
    }
}
