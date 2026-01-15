import Application from "../Application/Application.js";
import ServiceManager from "../Services/ServicesManager.js";

export default class PluginManager {

    constructor(){
        Object.freezeProp(PluginManager, "plugins", new ServiceManager());
        Object.freeze(this);
    }

    get names(){return this.pluginNames()}

    has(name){return PluginManager.plugins.has(name)}
    get(name){return PluginManager.plugins.get(name)}
    resolve(name){return PluginManager.plugins.resolve(name)}
    pluginNames(){return PluginManager.plugins.serviceNames()}

    // 安装插件
    use(plugin, options = {}) {
        if (typeof plugin !== "function"){throw new TypeError("Invalid plugin.")}
        const name = String.toNotEmptyString(plugin.serviceName, "Plugin service name");
        if (PluginManager.plugins.has(name)) {
            throw new Error(`The "${name}" plugin has been registered.`);
        }
        if (typeof plugin.install === "function") {
            plugin.install(Application.instance, options);
        }
        const config = Object.pure({singleton: false, dependency: []},false);
        if (plugin.singleton===true){config.singleton = true}
        if (Array.isArray(plugin.dependency)){config.dependency = dependency}
        if (Object.isObject(options)){Object.assign(config, options)}
        config.type = "plugin";
        config.installedAt = new Date();
        PluginManager.plugins.register(name, plugin, config);
        if (options.global===true){
            if (plugin.system){Object.freezeProp(Application.instance,name,this.resolve(name))}
            else {Application.instance[name]=this.resolve(name)}
        }
        return this;
    }

    // 卸载插件
    unuse(name) {
        if (!PluginManager.services.has(name)){return this;}
        const plugin = PluginManager.services.get(name);
        if (typeof plugin.uninstall === "function") {
            plugin.instance.uninstall(Application.instance);
        }
        PluginManager.services.delete(name);
        return this;
    }
}
