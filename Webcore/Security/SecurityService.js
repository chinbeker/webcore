import Generate from './Generate.js';
import Crypto from './Crypto.js';
import Hash from './Hash.js';
import AES from './AES.js';
import RSA from './RSA.js';

export default class SecurityService {
    static #instance = null;
    secureMode = false;
    generate = null;
    hash = null;
    aes = null;
    rsa = null;

    constructor(){
        if (SecurityService.#instance){
            return SecurityService.#instance;
        }
        this.secureMode = Boolean(crypto.subtle && (window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1'));
        this.generate = new Generate();
        this.hash = new Hash();
        this.aes = new AES();
        this.rsa = new RSA();
        if (this.secureMode){this.crypto = new Crypto()}
        SecurityService.#instance = this;
    }

    get environment() {
        return {
            secureMode: this.secureMode,
            isSecureContext: window.isSecureContext,
            hostname: location.hostname,
            protocol: location.protocol,
            cryptoSubtleAvailable: !!crypto.subtle
        };
    }
}
