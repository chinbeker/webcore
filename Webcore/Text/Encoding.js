export default class Encoding {
    static #instance = null;
    #encoder = new TextEncoder();
    #decoder = new TextDecoder('utf-8');

    constructor(){
        if (Encoding.#instance){
            return Encoding.#instance;
        }
        Object.freeze(this);
        Encoding.#instance = this;
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    base64ToArrayBuffer(base64) {
        const binary = window.atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0;i < binary.length;i ++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    stringToBase64(str) {
        if (str == undefined || str == null) {throw new TypeError('Parameter cannot be null or empty.');}
        if (typeof str !== 'string') {throw new TypeError('The parameter must be of string type.');}
        try {
            const bytes = this.#encoder.encode(str);
            return this.arrayBufferToBase64(bytes);
        } catch {
            throw new TypeError('Base64 encoding error.');
        }
    }

    base64ToString(base64){
        if (base64 == undefined || base64 == null) {throw new TypeError('Parameter cannot be null or empty.');}
        if (typeof base64 !== 'string') {throw new TypeError('The parameter must be of string type.');}
        try {
            return this.#decoder.decode(this.base64ToArrayBuffer(base64));
        } catch {
            throw new TypeError('Base64 decoding error.');
        }
    }

    stringToUrlBase64(str) {
        const standardBase64 = this.stringToBase64(str);
        return standardBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    urlBase64ToString(urlBase64) {
        let standardBase64 = urlBase64.replace(/-/g, '+').replace(/_/g, '/');
        while (standardBase64.length % 4) {standardBase64 += '=';}
        return this.base64ToString(standardBase64);
    }
}
