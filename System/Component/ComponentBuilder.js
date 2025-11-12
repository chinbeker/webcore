import Component from "./Component.js";

export default class ComponentBuilder {
    #name = 'my-element';
    #mode = 'open';
    #styles = null;
    #template = '<div><slot></slot></div>';
    #props = [];
    #methods = Object.create(null);
    #injections = [];

    constructor(){}


    name(name){
        if (typeof name !== 'string'){throw new Error('Component name must be a string value')}
        if (!name.includes('-')){throw new Error('Custom element names must contain a hyphen according to Web Components specification')}
        this.#name = name;
        return this;
    }

    template(template) {
        if (typeof template !== 'string'){throw new Error('Component template must be a string value')}
        this.#template = template.replace(/\n\s*/g, '').replace(/>\s+</g, '><').trim();
        return this;
    }

    styles(styles) {
        if (typeof styles !== 'string'){throw new Error('Component styles must be a string value')}
        this.#styles = styles.replace(/\n\s*/g, '')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/;\s*}/g, '}')
        .trim();
        return this;
    }

    mode(shadowMode = 'open') {
        if (!['open', 'closed'].includes(shadowMode)) {
            throw new Error('Shadow DOM mode must be either "open" or "closed"');
        }
        this.#mode = shadowMode;
        return this;
    }

    inject(...services){
        if (!Array.isArray(services)){throw new Error('Component service inject must be a array value')}
        this.#injections.push(...services);
        return this;
    }

    methods(methods = {}){
        if (typeof methods !== 'object' || methods === null){
            throw new Error('Methods parameter must be a valid object')
        }
        for (const key of Object.keys(methods)){
            this.#methods[key] = methods[key];
        }
        return this;
    }

    attributes(props = []){
        if (!Array.isArray(props)){throw new Error('Observed attributes must be provided as an array')}
        this.#props = props;
        return this;
    }

    create(func){
        if (typeof func !== 'function'){throw new Error('Create callback must be a function')}
        this.#methods.create = func;
        return this;
    }

    onConnected(func){
        if (typeof func !== 'function'){throw new Error('Connected callback must be a function')}
        this.#methods.onConnected = func;
        return this;
    }

    onAttributeChanged(func){
        if (typeof func !== 'function'){throw new Error('Attribute changed callback must be a function')}
        this.#methods.onAttributeChanged = func;
        return this;
    }

    onAdopted(func){
        if (typeof func !== 'function'){throw new Error('Adopted callback must be a function')}
        this.#methods.onAdopted = func;
        return this;
    }

    onDisconnected(func){
        if (typeof func !== 'function'){throw new Error('Disconnected callback must be a function')}
        this.#methods.onDisconnected = func;
        return this;
    }


    // 创建并注册组件
    build(){
        const builder = Object.create(null);

        builder.name = this.#name;
        builder.template = this.#template;
        builder.styles = this.#styles;
        builder.props = this.#props;
        builder.mode = this.#mode;

        builder.services = new Map();
        if (this.#injections.length > 0){
            for (const service of this.#injections){
                builder.services.set(service, app.services.resolve(service))
            }
        }

        const componentClass = class Builder extends HTMLElement {
            static template = null;
            static styles = null;
            #services = builder.services;
            name = builder.name;
            props = builder.props;
            root = null;
            constructor(){
                super();
                const shadow = this.attachShadow({ mode: builder.mode });
                if (builder.styles) {
                    if (Builder.styles){
                        shadow.adoptedStyleSheets = Builder.styles;
                    } else {
                        const sheet = new CSSStyleSheet();
                        sheet.replaceSync(builder.styles);
                        Builder.styles = [sheet];
                        shadow.adoptedStyleSheets = Builder.styles;
                    }
                }
                if (Builder.template){
                    this.root = Builder.template.cloneNode(true);
                } else {
                    const temp = document.createRange().createContextualFragment(builder.template);
                    Builder.template = temp;
                    this.root = temp.cloneNode(true);
                }
                shadow.appendChild(this.root);
                this.root = shadow;
                if (typeof this.create === 'function'){this.create()};
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (typeof this.onAttributeChanged === 'function') {
                    this.onAttributeChanged(name, oldValue, newValue);
                }
            }
            connectedCallback(){
                if (typeof this.onConnected === 'function'){this.onConnected(this)}
            }
            adoptedCallback(){
                if (typeof this.onAdopted === 'function'){this.onAdopted(this)}
            }
            disconnectedCallback(){
                if (typeof this.onDisconnected === 'function'){this.onDisconnected(this)}
            }

            // 服务依赖
            service(name) {
                if (!this.#services.has(name)){throw new Error(`Service "${name}" is not injected`);}
                return this.#services.get(name);
            }
            services(...names) {return names.map(name => this.service(name));}
            hasService(name) {return this.#services.has(name);}
            get injectedServices() {return Array.from(this.#services.keys());}

        };

        for (const key of Object.keys(this.#methods)){
            componentClass.prototype[key] = this.#methods[key]
        }

        if (Array.isArray(builder.props) && builder.props.length > 0){
            Object.defineProperty(componentClass, 'observedAttributes', {
                get() {return builder.props;},
                configurable: true,
                enumerable: true
            });
        }
        const component = new Component(builder, componentClass);
        return component;
    }
}
