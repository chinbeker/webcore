import Generate from "./Generate.js";
// import Crypto from "./Crypto.js";
// import Hash from "./Hash.js";
// import AES from "./AES.js";
// import RSA from "./RSA.js";

export default class SecurityService {
    static #instance = null;

    constructor(){
        if (SecurityService.#instance){return SecurityService.#instance;}
        Object.defineFreezeProperty(this, "secureMode", Boolean(crypto.subtle && window.isSecureContext));
        Object.defineFreezeProperty(this, "generate", new Generate());
        // if (this.generate){Object.defineFreezeProperty(this, "crypto", new Crypto());}
        SecurityService.#instance = this;
    }
}
