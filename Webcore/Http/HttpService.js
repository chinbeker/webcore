import HttpClient from "./HttpClient.js";

export default class HttpService {
    static #instance = null;

    constructor(cache){
        if (HttpService.#instance){return HttpService.#instance;}
        Object.freezeProp(HttpService,"api", new Map());
        Object.freezeProp(HttpClient,"cache", cache);
        HttpClient.method = ["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH", "OPTIONS"];
        HttpClient.config = {
            url: {type: "string"},
            baseUrl: {type: "string"},
            parse: {type: "string", valid: ["text", "json", "blob", "formData", "arrayBuffer"]},
            encoding: {type: "string"},
            onrequest: {type: "function"},
            onresponse: {type: "function"},
            timeout: {type: "number"},
            ontimeout: {type: "function"},
            abort: {type: "boolean"},
            onabort: {type: "function"},
            validateStatus: {type: "function"},
        }
        HttpClient.expand = {
            mode: {type: "string",valid: ["cors", "same-origin", "no-cors"]},
            credentials: {type: "string",valid: ["omit", "same-origin", "include"]},
            cache: {type: "string",valid: ["default", "no-cache", "no-store", "reload", "force-cache"]},
            redirect: {type: "string",valid: ["follow", "error", "manual"]}
        }
        HttpClient.format = ["text","json","css","script","htm","xml"];
        HttpClient.isKeyValuePair = function isKeyValuePair(target){
            return ["[object Object]","[object Map]"].includes(Object.prototype.toString.call(target));
        };
        HttpClient.parse = async function parse(type, response){
            switch (type) {
                case "json": return await response.json();
                case "text": return await response.text();
                case "blob": return await response.blob();
                case "formData": return await response.formData();
                case "arrayBuffer": return await response.arrayBuffer();
                default: return await response.text();
            }
        };
        Object.freeze(HttpClient);
        Object.freeze(HttpService);
        Object.freeze(this);
        HttpService.#instance = this;
    }

    create(config=null){return new HttpClient(config);}
    has(name){if (typeof name === "string" && name){return HttpService.api.has(name);}return false;}
    get(name){if (this.has(name)){return HttpService.api.get(name);}return null;}
    set(name, client){if (typeof name === "string" && name){HttpService.api.set(name, client);}return this;}
    delete(name){if (this.has(name)){HttpService.api.delete(name);return this;}}
    clear(){HttpService.api.clear();return true;}
}
