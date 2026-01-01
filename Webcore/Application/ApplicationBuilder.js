import Application from "./Application.js";
import ServiceManager from "../Services/ServicesManager.js";
// import PluginManager from "../Plugin/PluginManager.js";
import Configuration from "../Configuration/Configuration.js";
import RouterService from "../Router/RouterService.js";
import GlobalService from "../Global/GlobalService.js";
import LayoutService from "../Layout/LayoutService.js";
import EventService from "../Event/EventService.js";
import HttpService from "../Http/HttpService.js";
import CacheService from "../Cache/CacheService.js";
import StateService from "../State/StateService.js";
import ReactiveService from "../Reactive/ReactiveService.js";
import StorageService from "../Storage/StorageService.js";
import ComponentService from "../Component/ComponentService.js";
import ViewportService from "../Viewport/ViewportService.js";
import UtilityService from "../Utility/UtilityService.js";
import TextService from "../Text/TextService.js";
import SecurityService from "../Security/SecurityService.js";

export default class ApplicationBuilder {
    static #instance = null;
    #application = null;
    #configuration;
    #serviceManager;
    #pluginManager;
    #registry = [];

    constructor(){
        if (ApplicationBuilder.#instance) {
            return ApplicationBuilder.#instance;
        }
        this.#initialization();
        ApplicationBuilder.#instance = this;
    }
    #initialization(){
        this.#extension();
        // 创建服务容器对象
        this.#serviceManager = new ServiceManager();
        // 创建系统配置对象
        this.#configuration = new Configuration();

        // 系统初始配置
        this.#configuration.set("base", location.origin);
        this.#configuration.set("environment", window.isSecureContext && location.protocol === "http:" ? "development": "production");
    }

    #extension(){
        // 系统扩展方法
        Object.freeze(Object.prototype);
        // 扩展 Object
        Object.defineProperty(Application, "defineProperty", {
            value: function defineProperty(target, key, val, desc={}){
                if (target === null){throw new TypeError("Target cannot be null or undefined.");}
                if (typeof target !== "object" && typeof target !== "function") {throw new TypeError("Target must be an object or function.");}
                if (typeof key !== "string" && typeof key !== "symbol") {throw new TypeError("Property key must be a string or symbol.");}
                Object.defineProperty(target, key, {value: val, writable: false, enumerable: false, configurable: false, ...desc});return true;
            },
            writable: false, enumerable: false, configurable: false
        });

        // ------------------------------------  扩展 Object --------------------------------------
        // 创建定义冻结属性的方法(不可修改，不可枚举，不可配置)
        Object.defineProperty(Object, "defineFreezeProperty", {
            value: function defineFreezeProperty(target, key, val){return Application.defineProperty(target, key, val)},
            writable: false, enumerable: false, configurable: false
        });
        // 创建定义密封属性的方法(可修改，不可枚举，不可配置)
        Object.defineFreezeProperty(Object, "defineSealProperty",
            function defineSealProperty(target, key, val){return Application.defineProperty(target, key, val, {writable: true});}
        );
        // 检查类型
        Object.defineFreezeProperty(Object, "typeOf",
            function typeOf(target){
                if (target === undefined) {return "undefined";}
                if (target === null) {return "null";}
                return Object.prototype.toString.call(target).replace(/^\[object (\S+)\]$/, "$1").toLowerCase();
            }
        );
        // 判断是否普通简单 Object 类型
        Object.defineFreezeProperty(Object, "isObject",
            function isObject(target){return Object.prototype.toString.call(target) === "[object Object]";}
        );
        // 判断 Object 对象是否有原型
        Object.defineFreezeProperty(Object, "hasPrototype",
            function hasPrototype(target){
                if (target === null || typeof target !== "object"){return false;}
                return Object.getPrototypeOf(target) !== null && typeof Object.getPrototypeOf(target) === "object";
            }
        );
        // 返回没有原型的纯净 Object 对象（一般用于存储数据）
        Object.defineFreezeProperty(Object, "pure",
            function pure(target = null, clone = true){
                if (!Object.isObject(target)){return Object.create(null);}
                if (!Object.hasPrototype(target)){return target;}
                if (clone === true){
                    return Object.assign(Object.create(null), target);
                } else {
                    return Object.setPrototypeOf(target, null);
                }
            }
        );
        // 获取实例的构造函数
        Object.defineFreezeProperty(Object, "getConstructorOf",
            function getConstructorOf(target){
                if (!Object.hasPrototype(target)){throw new TypeError("Object prototype is null.");}
                const proto = Object.getPrototypeOf(target);
                if (!Object.hasOwn(proto, "constructor") || typeof proto.constructor !== "function"){
                    throw new TypeError("Constructor is invalid.")
                }
                return proto.constructor;
            }
        );
        // 判断对象是否是某构造函数的实例（通过name属性判断，可能不准确，因为name属性可以被修改）
        Object.defineFreezeProperty(Object, "isClassInstance",
            function isClassInstance(target, name){
                if (typeof name !== "string"){return false;}
                if (!Object.hasPrototype(target)){return false;}
                const proto = Object.getPrototypeOf(target);
                if (Object.hasOwn(proto, "constructor") && Object.hasOwn(proto.constructor, "name")){
                    if (proto.constructor.name === name){return true;}
                }
                return false;
            }
        );
        // 判断是否 HTML 元素
        Object.defineFreezeProperty(Object, "isElement",
            function isElement(target){return target instanceof HTMLElement;}
        );

        // ------------------------------------ 扩展 Number --------------------------------------
        // 判断是否为有效数字
        Object.defineFreezeProperty(Number, "isNumber",
            function isNumber(number){
                if (typeof number === "number" && Number.isFinite(number)) {return true;}
                return false;
            }
        );

        // ------------------------------------ 扩展 String --------------------------------------
        // 判断是否为空字符串
        Object.defineFreezeProperty(String, "isNullOrEmpty",
            function isNullOrEmpty(str){
                if (str === undefined || str === null || typeof str !== "string"){return true;}
                return str.length === 0;
            }
        );
        // 判断是否为空白字符串
        Object.defineFreezeProperty(String, "NON_WHITESPACE_REGEX", /\S/);                // 匹配时复用的正则对象
        Object.defineFreezeProperty(String, "isNullOrWhiteSpace",
            function isNullOrWhiteSpace(str){
                if (String.isNullOrEmpty(str)){return true;}
                return !String.NON_WHITESPACE_REGEX.test(str);
            }
        );
        // 判断是否为有效数字或非空字符（数字可以转换成字符串的应用场景中使用）
        Object.defineFreezeProperty(String, "isNumberOrString",
            function isNumberOrString(str){
                if (Number.isNumber(str) || !String.isNullOrEmpty(str)) {return true;}
                return false;
            }
        );

        // ------------------------------------  扩展 Error --------------------------------------
        // 检查参数是否为Null
        Object.defineFreezeProperty(Error, "throwIfNull",
            function throwIfNull(target, name=null){
                if (target === undefined){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} is required.`);
                }
                if (target === null){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} cannot be null.`);
                }
                return true;
            }
        );
        // 检查参数是否为 String 类型
        Object.defineFreezeProperty(Error, "throwIfNotString",
            function throwIfNotString(target, name = null){
                Error.throwIfNull(target, name);
                if (typeof target !== "string"){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} must be of string type.`);
                }
                return true;
            }
        );
        // 检查参数是否为空字符
        Object.defineFreezeProperty(Error, "throwIfEmpty",
            function throwIfEmpty(target, name=null){
                Error.throwIfNotString(target, name);
                if (target.length === 0){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} cannot be empty.`);
                }
                return true;
            }
        );
        // 检查参数是否为空白字符
        Object.defineFreezeProperty(Error, "throwIfWhiteSpace",
            function throwIfWhiteSpace(target, name=null){
                Error.throwIfNotString(target, name);
                if (!String.NON_WHITESPACE_REGEX.test(target)){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} cannot be empty or whitespace.`);
                }
                return true;
            }
        );
        // 检查参数是否为普通对象
        Object.defineFreezeProperty(Error, "throwIfNotObject",
            function throwIfNotObject(target, name=null){
                if (!Object.isObject(target)){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} must be of object type.`);
                }
                return true;
            }
        );
        // 检查参数是否为函数
        Object.defineFreezeProperty(Error, "throwIfNotFunction",
            function throwIfNotFunction(target, name=null){
                if (typeof target !== "function"){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} must be of function type.`);
                }
                return true;
            }
        );
        // 检查参数是否为有效的数字
        Object.defineFreezeProperty(Error, "throwIfNotNumber",
            function throwIfNotNumber(target, name=null){
                if (typeof target !== "number" || !Number.isFinite(target)){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} must be of number type.`);
                }
                return true;
            }
        );
        // 检查参数是否为数组
        Object.defineFreezeProperty(Error, "throwIfNotArray",
            function throwIfNotArray(target, name=null){
                if (!Array.isArray(target)){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} must be of array type.`);
                }
                return true;
            }
        );
        // 检查参数是否为 HTML 元素
        Object.defineFreezeProperty(Error, "throwIfNotElement",
            function throwIfNotElement(target, name=null){
                if (typeof HTMLElement === 'undefined') {throw new Error("DOM API is not available in this environment.");}
                if (!(target instanceof HTMLElement)){
                    throw new TypeError(`${String.isNullOrWhiteSpace(name) ? "Parameter" : name} must be a HTML element.`);
                }
                return true;
            }
        );

        // ------------------------------------ 其他扩展 --------------------------------------
        // (这些扩展方法依赖前面的扩展方法，所以要放在后面位置)

        // 去除字符串前后的空白，返回非空白字符串，或者返回提供的默认值（检查并抛出错误）
        Object.defineFreezeProperty(String, "toNotEmptyString",
            function toNotEmptyString(str, name=null, defaultValue=null){
                if (Number.isNumber(str)){str+="";}
                if (!String.isNumberOrString(defaultValue)){
                    Error.throwIfWhiteSpace(str, name);
                    return str.trim();
                } else if (String.isNullOrWhiteSpace(str)){
                    if (Number.isNumber(defaultValue)){defaultValue+="";}
                    Error.throwIfWhiteSpace(defaultValue, "Default value");
                    return defaultValue;
                } else {
                    Error.throwIfWhiteSpace(str, name);
                    return str.trim();
                }
            }
        );
        // 创建URL对象（检查并抛出错误）
        Object.defineFreezeProperty(URL, "create",
            function create(url, base = null){
                url = String.toNotEmptyString(url, "URL");
                if (base == null){
                    base = Object.hasOwn(self, "app") && self.app.configuration.has("base") ? self.app.configuration.get("base") : location.origin;
                } else {
                    Error.throwIfWhiteSpace(base, "baseUrl");
                }
                return new URL(url, base);
            }
        );
        // 创建 Element 对象
        Object.defineFreezeProperty(Element, "create",
            function create(tag = "div", text = "", attrs = null){
                tag = String.toNotEmptyString(tag, "Tag name", "div");
                const ele = document.createElement(tag);
                if (Object.isObject(attrs)){
                    for (const [key, value] of Object.entries(attrs)){
                        ele.setAttribute(key, value || "");
                    }
                    attrs = null;
                }
                if (text){ele.textContent = text;}
                return ele;
            }
        );
        // 深层批量创建 Element 对象
        Object.defineFreezeProperty(Element, "createAll",
            function createAll(config){
                if (Object.isObject(config)){
                    const parent = Element.create(config.tag, config.text, config.attrs);
                    if (Array.isArray(config.children) && config.children.length > 0){
                        for (const child of config.children){
                            if (Object.isObject(child)){parent.append(Element.createAll(child))}
                        }
                    }
                    return parent;
                }
                return document.createElement("div");
            }
        );
    }

    setConfig(key, value) {
        this.#configuration.set(key, value);
        return this;
    }

    addSingleton(name, service, deps){
        this.#serviceManager.addSingleton(name, service, deps);
        this.#registry.push(name);
        return this;
    }

    addTransient(name, service, deps) {
        this.#serviceManager.addTransient(name, service, deps);
        this.#registry.push(name);
        return this;
    }

    build(){
        console.log("3. 各项服务启动");
        const application = new Application(this.#configuration, this.#serviceManager, this.#pluginManager);
        // 缓存不是单例服务（单独注册）
        this.#serviceManager.addTransient("cache", CacheService);
        Object.defineFreezeProperty(application, "cache", new CacheService());
        // 批量注册单例服务
        const services = [
            {name: "router", service: RouterService},
            {name: "layout", service: LayoutService, public: true},
            {name: "global", service: GlobalService, public: true},
            {name: "event", service: EventService},
            {name: "http", service: HttpService, deps: ["cache"]},
            {name: "state", service: StateService, public: true},
            {name: "storage", service: StorageService, public: true},
            {name: "reactive", service: ReactiveService},
            {name: "component", service: ComponentService, public: true},
            {name: "viewport", service: ViewportService, public: true},
            {name: "utility", service: UtilityService, public: true},
            {name: "text", service: TextService, public: true},
            {name: "security", service: SecurityService, public: true}
        ];
        for (const service of services){
            this.#serviceManager.addSingleton(service.name, service.service, service.deps);
            const instance = this.#serviceManager.get(service.name);
            if (service.public) {
                Object.defineFreezeProperty(application, service.name, instance);
            }
        }
        Object.freeze(application);
        return application;
    }
}
