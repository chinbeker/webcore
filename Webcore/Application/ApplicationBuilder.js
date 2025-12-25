import Application from "./Application.js";
import ServiceManager from "../Services/ServicesManager.js";
import Configuration from "../Configuration/Configuration.js";

export default class ApplicationBuilder {
    static #instance = null;
    #application = null;
    #configuration;
    #serviceManager;
    #pluginManager;
    #services = [];

    constructor(){
        if (ApplicationBuilder.#instance) {
            return ApplicationBuilder.#instance;
        }
        this.#initialization();
        ApplicationBuilder.#instance = this;
    }
    #initialization(){
        this.#extension();
        this.#configuration = new Configuration();
        this.#configuration.set('base', location.origin);
        this.#configuration.set('environment', window.isSecureContext && location.protocol === 'http:' ? 'development': 'production');
        this.#serviceManager = new ServiceManager();
    }

    #extension(){
        // 系统扩展方法
        Object.defineProperty(Object, 'defineReadOnlyProperty', {
            value: function defineReadOnlyProperty(target, key, val){
                if (target == null){throw new TypeError('Target cannot be null or undefined.');}
                if (typeof target !== 'object' && typeof target !== 'function') {throw new TypeError('Target must be an object or function.');}
                if (typeof key !== 'string' && typeof key !== 'symbol') {throw new TypeError('Property key must be a string or symbol.');}
                const descriptor = Object.getOwnPropertyDescriptor(target, key);
                if (descriptor && !descriptor.configurable){throw new TypeError(`Cannot redefine non-configurable property: ${key}`);}
                Object.defineProperty(target, key, {value: val, writable: false, enumerable: false, configurable: false});return true;
            },
            writable: false, enumerable: false, configurable: false
        });
        Object.defineReadOnlyProperty(Object, 'isObject',
            function isObject(target){return Object.prototype.toString.call(target) === '[object Object]';}
        );
        Object.defineReadOnlyProperty(Object, 'hasPrototype',
            function hasPrototype(target){if (target == null || typeof target !== 'object'){return false;}return Object.getPrototypeOf(target) != null;}
        );
        Object.defineReadOnlyProperty(Object, 'cob',
            function cob(target = null){
                const obj = Object.create(null);
                if (Object.isObject(target) && Object.hasPrototype(target)){Object.assign(obj, target);}
                return obj;
            }
        );
        Object.defineReadOnlyProperty(String, 'isNullOrEmpty',
            function isNullOrWhiteSpace(str){return str == null || (typeof str === 'string' && str.length === 0);}
        );
        Object.defineReadOnlyProperty(ApplicationBuilder, 'NON_WHITESPACE_REGEX', /\S/);
        Object.defineReadOnlyProperty(String, 'isNullOrWhiteSpace',
            function isNullOrWhiteSpace(str){return str == null || (typeof str === 'string' && !ApplicationBuilder.NON_WHITESPACE_REGEX.test(str));}
        );
    }

    setConfig(key, value) {
        this.#configuration.set(key, value);
        return this;
    }

    addService(name, service, options = {}) {
        this.#serviceManager.register(name, service, options);
        this.#services.push(name);
        return this;
    }

    addSingleton(name, service, deps = []){
        this.#serviceManager.addSingleton(name, service, deps);
        this.#services.push(name);
        return this;
    }

    addTransient(name, service, deps = []) {
        this.#serviceManager.addTransient(name, service, deps);
        this.#services.push(name);
        return this;
    }

    build(){
        console.log('3. 各项服务启动');
        const application = new Application(this.#configuration, this.#serviceManager, this.#pluginManager);
        for (const name of this.#services){
            application[name] = (this.#serviceManager.get(name));
        }
        Object.freeze(application);
        return application;
    }
}
