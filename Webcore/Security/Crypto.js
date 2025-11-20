export default class Crypto {
    static #instance = null;
    #crypto = null;
    constructor(){
        if (Crypto.#instance){
            return Crypto.#instance;
        }
        this.#crypto = self.crypto.subtle;
        Crypto.#instance = this;
    }

    async GenerateRsaKey(){
        try {
            const key = Object.create(null);
            const cryptoKeys = await window.crypto.subtle.generateKey(
                {name: "RSA-OAEP", modulusLength: 2048,publicExponent: new Uint8Array([0x01, 0x00, 0x01]),hash: "SHA-256"},
                true,["encrypt", "decrypt"]
            );
            key.CryptoKeys = cryptoKeys;
            const exportKeys = Object.create(null);
            const publicKey = await window.crypto.subtle.exportKey("spki", cryptoKeys.publicKey);
            exportKeys.PublicKey = window.btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey)));
            const privateKey = await window.crypto.subtle.exportKey("pkcs8", cryptoKeys.privateKey);
            exportKeys.PrivateKey = window.btoa(String.fromCharCode.apply(null, new Uint8Array(privateKey)));
            key.ExportKeys = exportKeys;
            return key;
        } catch (error) {
            throw new Error('\u521b\u5efa\u5bc6\u94a5\u65f6\u51fa\u9519');
        }
    }

    async ImportRsaPublicKey(publicKey) {
        const binary = Uint8Array.from(window.atob(publicKey), c => c.charCodeAt(0)).buffer;
        return await window.crypto.subtle.importKey("spki", binary, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, true, ["encrypt"]);
    }

    async ImportRsaPrivateKey(privateKey) {
        const binary = Uint8Array.from(window.atob(privateKey), c => c.charCodeAt(0)).buffer;
        return await window.crypto.subtle.importKey("pkcs8", binary, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, true, ["decrypt"]);
    }

    async RsaEncrypt(plaintext, publicKey) {
        if (publicKey == undefined || publicKey == null) {throw new Error('\u5bc6\u94a5\u4e0d\u80fd\u4e3a\u7a7a');}
        if (Object.prototype.toString.call(publicKey) !== '[object CryptoKey]') {throw new Error('\u5bc6\u94a5\u65e0\u6548');}
        if (plaintext == undefined || plaintext == null) {throw new Error('\u8981\u52a0\u5bc6\u7684\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a');}
        if (typeof plaintext !== 'string') {throw new Error('\u8981\u52a0\u5bc6\u7684\u5185\u5bb9\u5fc5\u987b\u662f\u5b57\u7b26\u4e32\u7c7b\u578b');}
        try {
            const encoder = new TextEncoder('utf-8');
            const bytes = encoder.encode(plaintext);
            const plaintextLength = bytes.length;
            plaintext = null;
            if (plaintextLength > 141) {
                const encryptChunks = [];
                const decoder = new TextDecoder('utf-8');
                let i = 0;
                while (i < plaintextLength){
                    const encrypted = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, publicKey,
                        encoder.encode(decoder.decode(bytes.slice(i, i+141)))
                    );
                    encryptChunks.push(window.btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted))));
                    i += 141;
                }
                return encryptChunks.join('');
            } else {
                const encrypted = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, publicKey, bytes);
                return window.btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
            }
        } catch (error) {
            throw new Error('\u52a0\u5bc6\u5931\u8d25');
        }
    }

    async RsaDecrypt(ciphertext, privateKey) {
        if (privateKey == undefined || privateKey == null) {throw new Error('\u5bc6\u94a5\u4e0d\u80fd\u4e3a\u7a7a');}
        if (Object.prototype.toString.call(privateKey) !== '[object CryptoKey]') {throw new Error('\u5bc6\u94a5\u65e0\u6548');}
        if (ciphertext == undefined || ciphertext == null) {throw new Error('\u8981\u89e3\u5bc6\u7684\u5bc6\u6587\u4e0d\u80fd\u4e3a\u7a7a');}
        if (typeof ciphertext !== 'string') {throw new Error('\u8981\u89e3\u5bc6\u7684\u5bc6\u6587\u5fc5\u987b\u4e3a\u5b57\u7b26\u4e32');}
        const ciphertextLength = new TextEncoder().encode(ciphertext).length;
        try {
            const decoder = new TextDecoder('utf-8');
            if (ciphertextLength > 344){
                const decryptChunks = [];
                let i = 0;
                while (i < ciphertextLength) {
                    const binary = window.atob(ciphertext.substring(i, i+344));
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0;i < binary.length;i ++){bytes[i] = binary.charCodeAt(i);}
                    const decrypted = await window.crypto.subtle.decrypt({name: "RSA-OAEP"}, privateKey, bytes.buffer);
                    decryptChunks.push(decoder.decode(decrypted));
                    i += 344;
                }
                return decryptChunks.join('');
            } else {
                const binary = window.atob(ciphertext);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0;i < binary.length;i ++) {bytes[i] = binary.charCodeAt(i);}
                const decrypted = await window.crypto.subtle.decrypt({name: "RSA-OAEP"}, privateKey, bytes.buffer);
                return decoder.decode(decrypted);
            }
        } catch (error) {
            throw new Error('\u89e3\u5bc6\u5931\u8d25');
        }
    }

    async GenerateAesKey(){
        try {
            const key = Object.create(null);
            key.CryptoKey = await window.crypto.subtle.generateKey({name: "AES-GCM",length: 256}, true, ["encrypt", "decrypt"]);
            key.RawKey = await window.crypto.subtle.exportKey("raw", key.CryptoKey);
            key.JwkKey = await window.crypto.subtle.exportKey("jwk", key.CryptoKey);
            key.ExportKey = window.btoa(String.fromCharCode.apply(null, new Uint8Array(key.RawKey)));
            return key;
        } catch (error) {
            throw new Error('\u521b\u5efa\u5bc6\u94a5\u65f6\u51fa\u9519');
        }
    }

    async ImportAesKey(base64Key) {
        if (base64Key == undefined || base64Key == null) {throw new Error('密钥不能为空');}
        if (typeof base64Key !== 'string') {throw new Error('密钥类型错误');}
        const binary = window.atob(base64Key);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {bytes[i] = binary.charCodeAt(i);}
        return await window.crypto.subtle.importKey("raw", bytes.buffer, {name: "AES-GCM"}, true, ["encrypt", "decrypt"]);
    }

    async AesEncrypt(plaintext, key) {
        if (key == undefined || key == null) {throw new Error('\u5bc6\u94a5\u4e0d\u80fd\u4e3a\u7a7a');}
        if (Object.prototype.toString.call(key) !== '[object CryptoKey]') {throw new Error('\u5bc6\u94a5\u65e0\u6548');}
        if (plaintext == undefined || plaintext == null) {throw new Error('\u8981\u52a0\u5bc6\u7684\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a');}
        if (typeof plaintext !== 'string') {throw new Error('\u8981\u52a0\u5bc6\u7684\u5185\u5bb9\u5fc5\u987b\u662f\u5b57\u7b26\u4e32\u7c7b\u578b');}
        try {
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const ciphertext = await window.crypto.subtle.encrypt({name: "AES-GCM",iv: iv, tagLength: 128}, key, new TextEncoder().encode(plaintext));
            const decrypted = Object.create(null);
            decrypted.IV = window.btoa(String.fromCharCode.apply(null, new Uint8Array(iv)));
            decrypted.Data = window.btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext)));
            return decrypted;
        } catch (error) {
            throw new Error('\u52a0\u5bc6\u5931\u8d25');
        }
    }

    async AesDecrypt(ciphertext, key, iv){
        if (key == undefined || key == null) {throw new Error('\u5bc6\u94a5\u4e0d\u80fd\u4e3a\u7a7a');}
        if (Object.prototype.toString.call(key) !== '[object CryptoKey]') {throw new Error('\u5bc6\u94a5\u65e0\u6548');}
        if (iv == undefined || iv == null) {throw new Error('\u52a0\u5bc6\u5411\u91cf\u4e0d\u80fd\u4e3a\u7a7a');}
        if (typeof iv !== 'string') {throw new Error('\u52a0\u5bc6\u5411\u91cf\u5fc5\u987b\u4e3a\u5b57\u7b26\u4e32');}
        if (ciphertext == undefined || ciphertext == null) {throw new Error('\u8981\u89e3\u5bc6\u7684\u5bc6\u6587\u4e0d\u80fd\u4e3a\u7a7a');}
        if (typeof ciphertext !== 'string') {throw new Error('\u8981\u89e3\u5bc6\u7684\u5bc6\u6587\u5fc5\u987b\u4e3a\u5b57\u7b26\u4e32');}
        try {
            const ivBinary = window.atob(iv);
            const ivBytes = new Uint8Array(ivBinary.length);
            for (let i = 0;i < ivBinary.length;i ++) {ivBytes[i] = ivBinary.charCodeAt(i);};
            const ciphertextBinary = window.atob(ciphertext);
            const ciphertextBytes = new Uint8Array(ciphertextBinary.length);
            for (let i = 0;i < ciphertextBinary.length;i ++) {ciphertextBytes[i] = ciphertextBinary.charCodeAt(i);};
            const decrypted = await window.crypto.subtle.decrypt({name: "AES-GCM", iv: ivBytes.buffer, tagLength: 128},key,ciphertextBytes);
            return new TextDecoder().decode(decrypted);
        } catch (error) {
            throw new Error('\u89e3\u5bc6\u5931\u8d25');
        }
    }

}
