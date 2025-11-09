import ServicesManager from "/System/Services/ServicesManager.js";
import Configuration from "/System/Configuration/Configuration.js";
import Component from "./Component.js";

export default class ComponentBuilder {
    #name = '';
    #mode = 'open';
    #styles = null;
    #template = '<div></div>';
    #configuration = null;
    #services = null;
    #properties = {};
    #methods = {};

    constructor(){
        this.#services = new ServicesManager();
        this.#services.Register('config', Configuration);
    }

    // 添加其他配置方法
    template(componentTemplate = '<div></div>') {
        this.#template = componentTemplate;
        return this;
    }

    styles(componentStyles = null) {
        this.#styles = componentStyles;
        return this;
    }

    mode(shadowMode = 'open') {
        this.#mode = shadowMode;
        return this;
    }



    // 创建并注册组件
    build(){
        const builder = Object.create(null);
        builder.template = this.#template;
        builder.styles = this.#styles;
        builder.mode = this.#mode;

        const componentClass =  class Builder extends HTMLElement {
            static template = null;
            static styles = null;
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
                    shadow.appendChild(Builder.template.firstElementChild.cloneNode(true));
                } else {
                    const temp = document.createRange().createContextualFragment(builder.template);
                    Builder.template = temp;
                    shadow.appendChild(temp.firstElementChild.cloneNode(true));
                }
            }

            attributeChangedCallback(){}
            connectedCallback(){

            }
            adoptedCallback(){}
            disconnectedCallback(){

            }
        };

        return component;
    }
}
