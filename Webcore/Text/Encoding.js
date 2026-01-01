export default class Encoding {
    static #instance = null;

    constructor(){
        if (Encoding.#instance){return Encoding.#instance;}
        Object.defineFreezeProperty(Encoding, "encoder", new TextEncoder());
        Object.defineFreezeProperty(Encoding, "decoder", new TextDecoder("utf-8"));
        Object.freeze(Encoding);
        Encoding.#instance = this;
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = "";
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
        Error.throwIfNull(str);
        Error.throwIfEmpty(str);
        try {
            const bytes = Encoding.encoder.encode(str);
            return this.arrayBufferToBase64(bytes);
        } catch {
            throw new TypeError("Base64 encoding error.");
        }
    }

    base64ToString(base64){
        Error.throwIfNull(base64);
        Error.throwIfEmpty(base64);
        try {
            return Encoding.decoder.decode(this.base64ToArrayBuffer(base64));
        } catch {
            throw new TypeError("Base64 decoding error.");
        }
    }

    stringToUrlBase64(str) {
        const standardBase64 = this.stringToBase64(str);
        return standardBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    urlBase64ToString(urlBase64) {
        let standardBase64 = urlBase64.replace(/-/g, "+").replace(/_/g, "/");
        while (standardBase64.length % 4) {standardBase64 += "=";}
        return this.base64ToString(standardBase64);
    }
}
