export default class ServiceManager {
    #services = new Map();
    #singletons = new Map();

    constructor(){

    }

    // 创建服务实例（支持依赖注入）
    #createInstance(service) {
        // 如果有依赖项，先解析依赖
        const dependencies = service.dependencies.map(depName => this.Resolve(depName));

        // 创建实例（支持构造函数依赖注入）
        return new service.implementation(...dependencies);
    }

    // 解析服务
    Resolve(name) {
        if (!this.has(name)){
            throw new Error(`Service '${name}' not registered`);
        }
        const service = this.#services.get(name);

        // 单例模式
        if (service.singleton) {
            if (!this.#singletons.has(name)) {
                this.#singletons.set(name, this.#createInstance(service));
            }
            return this.#singletons.get(name);
        }
        // 瞬态模式
        else {
            return this.#createInstance(service);
        }
    }

    // 获取服务
    get(name){ return this.Resolve(name);}

    // 检查服务是否已注册
    has(name) {return this.#services.has(name);}

    // 获取所有已注册的服务名称
    getRegisteredServices() {return Array.from(this.#services.keys());}

    /**
     * 统一注册方法
     * @param {string} name - 服务名称
     * @param {Function} implementation - 服务实现类
     * @param {Object} options - 注册选项
     * @param {boolean} options.singleton - 是否单例（默认false）
     * @param {Array} options.dependencies - 依赖项列表
     */
    Register(name, implementation, options = {}) {
        const config = {
            singleton: false,
            dependencies: [],
            ...options
        };

        this.#services.set(name, {
            implementation,
            ...config
        });

        return this;
    }

    // 服务销毁功能
    Destroy() {
        this.#singletons.forEach(instance => {
            if (typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });
        this.#services.clear();
        this.#singletons.clear();
    }

}
