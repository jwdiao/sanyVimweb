import CryptoJS from 'crypto-js'
import { TRIPLEDES_KEY } from './Constants'

let _Encrypt = {
    encryptBy3DES: null,
    decryptBy3DES: null
}

//DES加密 Pkcs7填充方式
_Encrypt.encryptBy3DES = (message, key = TRIPLEDES_KEY) => {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
//DES解密
_Encrypt.decryptBy3DES = (ciphertext, key = TRIPLEDES_KEY) => {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    // direct decrypt ciphertext
    const decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export const Encrypt = _Encrypt;