export default class HttpClient {
    url = null;
    baseUrl = null;
    parse = "text";
    headers = Object.pure();
    payload = Object.pure();
    expand = Object.pure();
    encoding = "utf-8";
    abort = false;
    abortController = null;
    cache = 0;
    timeout = 0;
    timeoutId = null;
    ontimeout = (message)=>{console.info(message || "Request timeout.")};
    onabort = (message)=>{console.info(message || "Request aborted.")}

    constructor(config=null){
        // 检查 url
        if (!HttpClient.isKeyValuePair(config)){throw new TypeError("Invalid configuration.")}
        if (!Object.hasOwn(config, "url")){throw new TypeError("URL is required.")}

        // 检查参数类型
        for (const [key, prop] of Object.entries(HttpClient.config)){
            if (Object.hasOwn(config, key)){
                if (typeof config[key] !== prop.type){throw new TypeError(`The ${key} must be of ${prop.type} type.`)}
                if (Object.hasOwn(prop, "valid") && !prop.valid.includes(config[key])){throw new TypeError(`The ${key} is invalid.`)}
                this[key] = config[key];
            }
        }

        // 处理缓存
        if (typeof config.cache === "number"){
            if (Number.isNumber(config.cache)){this.cache = config.cache;} delete config.cache;
        }

        // 检查 headers、payload
        for (const key of ["headers", "payload"]){
            if (Object.hasOwn(config, key)) {
                if (!HttpClient.isKeyValuePair(config[key])){throw new TypeError(`The ${key} must be of object type.`)}
                for (const prop of Object.keys(config[key])){this[key][prop] = config[key][prop];}
            }
        }

        // 检查 expand
        for (const [key, prop] of Object.entries(HttpClient.expand)){
            if (Object.hasOwn(config, key)){
                if (typeof config[key] !== prop.type) {throw new TypeError(`The ${key} must be of ${prop.type} type.`);}
                if (!prop.valid.includes(config[key])) {throw new TypeError(`The ${key} is invalid.`);}
                this.expand[key] = config[key];
            }
        }

        // 添加字符集
        for (const header of ["Content-Type", "Accept"]){
            if (Object.hasOwn(this.headers, header)) {
                for (const type of HttpClient.format){
                    if (this.headers[header].includes(type)){
                        this.headers[header] = `${this.headers[header]}; charset=${this.encoding}`;
                        break;
                    }
                }
            }
        }
    }

    get authorization(){
        if (this.headers && Object.hasOwn(this.headers,"Authorization")){
            return this.headers["Authorization"];
        }
        return "";
    }
    set authorization(value){
        if (typeof value === "string"){
            this.headers["Authorization"] = value;
        }
    }
    get contentType(){
        if (this.headers && Object.hasOwn(this.headers,"Content-Type")){
            return this.headers["Content-Type"];
        }
        return "";
    }
    set contentType(value){
        if (typeof value === "string"){
            for (const format of HttpClient.format){
                if (value.includes(format)){
                    this.headers["Content-Type"] = `${value}; charset=${this.encoding}`;
                    break;
                }
            }
        }
    }

    getUrl(payload=null){
        try {
            const url = URL.create(this.url, this.baseUrl);
            payload = payload || this.payload;
            if (HttpClient.isKeyValuePair(payload)){
                for (const key of Object.keys(payload)){url.searchParams.set(key, payload[key])}
            }
            return url;
        } catch (error) {
            throw error;
        }
    }

    cancel(){
        if (this.abortController){
            this.abortController.abort();
            return true;
        }
        return false;
    }

    async send(url=null, method="GET", payload=null, timeout=0, abort=false){
        url = url || this.getUrl();
        if (this.cache > 0 && HttpClient.cache.has(url.href)){
            return Promise.resolve(HttpClient.cache.get(url.href));
        }
        const options = Object.pure();

        // 检查 method
        if (typeof method !== "string"){throw new TypeError("The method is invalid.")}
        options.method = method.trim().toUpperCase();
        if (!HttpClient.method.includes(options.method)){throw new TypeError("The method is invalid.")}
        if (Object.keys(this.headers).length > 0){options.headers = new Headers(this.headers);}
        Object.assign(options, this.expand);

        if (payload && typeof payload === "object"){
            if (HttpClient.isKeyValuePair(payload)){
                payload = JSON.stringify(payload);
                if (Object.hasOwn(options, "headers")){
                    options.headers.set("Content-Type",`application/json; charset=${this.encoding}`);
                }
            } else if (Object.hasOwn(options, "headers")) {
                options.headers.delete("Content-Type");
            }
        }
        if (payload){options.body = payload;}

        // 控制器
        this.abortController = new AbortController();
        options.signal = this.abortController.signal;

        // 请求前钩子函数
        if (typeof this.onrequest === "function"){this.onrequest(options)}

        timeout = Number(timeout) || Number(this.timeout) || 0;
        if (timeout > 0){
            this.timeoutId = setTimeout(()=>{
                this.abortController.abort();
                if (typeof this.ontimeout === "function"){this.ontimeout();}
            }, timeout);
        }

        try {
            const response = await fetch(url, options);
            if (this.timeoutId){clearTimeout(this.timeoutId)}
            if (!response.ok){
                if (typeof this.validateStatus === "function") {
                    return this.validateStatus(response);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }
            const responseData = await HttpClient.parse(this.parse, response);
            if (this.cache > 0){HttpClient.cache.set(url.href, responseData, {absolute: this.cache})}
            if (typeof this.onresponse === "function"){return this.onresponse(responseData)}
            return responseData;
        } catch (error) {
            if (this.timeoutId){clearTimeout(this.timeoutId)}
            if (error.name === "AbortError"){
                if (typeof this.onabort === "function"){return this.onabort()}
            }
            throw error;
        } finally {
            if (this.timeoutId){
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.abortController = null;
        }
    }

    async get(payload=null, timeout=0, abort=false){
        try {
            const url = this.getUrl(payload);
            return await this.send(url, "GET", null, timeout, abort);
        } catch (error) {throw error;}
    }

    async post(payload, timeout=0, abort=false){
        return await this.send(null, "POST", payload, timeout, abort);
    }

    async put(payload, timeout=0, abort=false){
        return await this.send(null, "PUT", payload, timeout, abort);
    }

    async delete(payload, timeout=0, abort=false){
        return await this.send(null, "DELETE", payload, timeout, abort);
    }

}
