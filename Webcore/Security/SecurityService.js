import Generate from "./Generate.js";
// import Crypto from "./Crypto.js";
// import Hash from "./Hash.js";
// import AES from "./AES.js";
// import RSA from "./RSA.js";

export default class SecurityService {
    static #instance = null;

    static singleton = true;
    // static system = true;
    static serviceName = "security";

    constructor(){
        if (SecurityService.#instance){return SecurityService.#instance;}
        Object.freezeProp(this, "secureMode", Boolean(crypto.subtle && window.isSecureContext));
        Object.freezeProp(this, "generate", new Generate());
        Object.sealProp(this, "crypto", null)
        SecurityService.#instance = this;
    }
}
