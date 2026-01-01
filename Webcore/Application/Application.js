import ApplicationBuilder from "./ApplicationBuilder.js";

export default class Application {
    static #instance = null;

    constructor(configuration, services, plugin){
        if (Application.#instance) {return Application.#instance;}
        Object.defineFreezeProperty(this, "configuration", configuration);
        Object.defineFreezeProperty(Application, "services", services);
        Object.freeze(Application);
        Application.#instance = this;
    }

    static createBuilder(){return new ApplicationBuilder();}

    getConfig(key){return this.configuration.get(key);}
    setConfig(key,value){return this.configuration.set(key,value);}
    getService(name){return Application.services.get(name);}
    hasService(name){return Application.services.has(name);}
    serviceNames(){return Application.services.serviceNames();}

    async loader(url){
        url = URL.create(url);
        try {
            const res = await fetch(url);
            return await res.text();
        } catch (error) {throw error;}
    }

    run(){
        console.log("5. 应用程序启动中……");
        if (Object.hasOwn(this, "initial")){this.initial.execute();}
        console.log("7. 应用程序启动完成");
        delete Object.getPrototypeOf(this).run;
    }
}
