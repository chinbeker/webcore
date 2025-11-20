export default class PluginManager {
    #plugins = new Map();
    constructor(){

    }

    get name(){
        return this.constructor.name;
    }

    // 插件安装方法
    install(app, options = {}) {
        throw new Error('"install" method must be implemented by subclass')
    }

    // 插件卸载方法
    uninstall(app) {
        throw new Error('"uninstall" method must be implemented by subclass')
    }

    onstart(){

    }

    onstop(){

    }

    // 安装插件
    use(plugin, options = {}) {
        const name = plugin.name || plugin.constructor.name;
        if (this.#plugins.has(name)) {
            console.warn(`插件 '${name}' 已安装`);
            return this;
        }
        if (typeof plugin.install === 'function') {
            plugin.install(this, options);
        } else if (typeof plugin === 'function') {
            plugin(this, options);
        } else {
            throw new Error('插件必须提供 install 方法或是一个函数');
        }

        this.#plugins.set(name, {
            instance: plugin,
            options,
            installedAt: new Date()
        });

        console.log(`插件 '${name}' 安装成功`);

        return this;
    }

    // 卸载插件
    unuse(name) {
        if (!this.#plugins.has(name)){
            console.warn(`插件 '${name}' 未安装`);
            return this;
        }
        const plugin = this.#plugins.get(name);

        if (typeof plugin.instance.uninstall === 'function') {
            plugin.instance.uninstall(this);
        }

        this.#plugins.delete(name);
        console.log(`插件 '${name}' 卸载成功`);

        return this;
    }
}
