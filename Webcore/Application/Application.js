import ApplicationBuilder from "./ApplicationBuilder.js";


export default class Application {
    static #instance = null;
    configuration = null;
    services = null;

    constructor(configuration, services){
        if (Application.#instance) {
            return Application.#instance;
        }
        this.configuration = configuration;
        this.services = services;
        Application.#instance = this;
    }

    static createBuilder(){return new ApplicationBuilder();}
    getConfig(key) {return this.configuration.get(key);}
    getService(name) {return this.services.get(name);}
    hasService(name) {return this.services.has(name);}


    cob(target=null){
        const obj = Object.create(null);
        if (this.typeOf(target) === 'object' && Object.getPrototypeOf(target) !== null){
            Object.assign(obj, target);
        }
        return obj;
    }

    cfn(target, func){
        if (typeof func !== 'function') {return null;}
        if (func.length == 1) {return ()=>{func(target)};}
        if (func.length > 1) {return (...args)=>{func(target, ...args)};}
        return null;
    };

    typeOf(target){
        if (target === undefined) {return 'undefined';}
        if (target === null) {return 'null';}
        return Object.prototype.toString.call(target).replace(/^\[object (\S+)\]$/, '$1').toLowerCase();
    }

    async loader(url=''){
        if (typeof url !== 'string'){throw new Error('URL parameters must be of string type.')}
        if (!url){throw new Error('URL parameter cannot be empty.')}
        try {
            const res = await fetch(url);
            return await res.text();
        } catch (error) {throw error;}
    }

    createElement(tag = 'div', text = '', attr = null){
        tag = (typeof tag === 'string' && tag) ? tag : 'div';
        const ele = document.createElement(tag );
        if (this.typeOf(attr) === 'object'){
            for (const [key,value] of Object.entries(attr)) {
                ele.setAttribute(key, value || '');
            }
            attr = null;
        }
        if (text){ele.textContent = text;}
        return ele;
    };




    // 获取所有已注册的服务名称
    serviceNames(){return this.services.serviceNames();}


    run(){
        console.log('5. 应用程序启动中……');
        if (Object.hasOwn(this, 'initial')){this.initial.execute();}
        console.log('7. 应用程序启动完成');
    }
}
