import Component from "./Component.js";
import App from "../App.js";

export default class ComponentBuilder {
    #name = 'core-element';
    #mode = 'open';
    #styles = null;
    #template = '<div><slot></slot></div>';
    #props = [];
    #methods = Object.create(null);
    #inject = [];

    constructor(){}


    name(name){
        if (name && typeof name === 'string'){
            if (!name.includes('-')){name = `core-${name}`;}
            this.#name = name;
        }
        return this;
    }

    template(template) {
        if (template && typeof template === 'string'){
            if (template){this.#template = template.replace(/\n\s*/g, '').replace(/>\s+</g, '><').trim();}
        }
        return this;
    }

    styles(styles) {
        if (styles && typeof styles === 'string'){
            this.#styles = styles.replace(/\n\s*/g, '')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*;\s*/g, ';')
            .replace(/;\s*}/g, '}')
            .trim();
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

        const componentClass = class Builder extends HTMLElement {
            static template = null;
            static styles = null;
            name = builder.name;
            props = builder.props;
            shadow = null;
            state = Object.create(null);
            element = Object.create(null);
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
                this.shadow = shadow;
                this.root = shadow.firstElementChild;
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

            selector(selector){return this.shadow.querySelector(selector)}
            service(name) {return Object.hasOwn(this.services, name) ? this.services[name] : null;}
        };

        if (this.#inject.length > 0){
            builder.services = Object.create(null);
            for (const service of this.#inject){
                builder.services[service] = App.services.get(service)
            }
            componentClass.prototype.services = builder.services;
        }

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
