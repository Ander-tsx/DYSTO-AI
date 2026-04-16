import CryptoJS from "crypto-js";

const KEY = process.env.NEXT_PUBLIC_FIELD_KEY;

export function encryptPayload(data) {
    const iv = CryptoJS.lib.WordArray.random(16);

    const parsedKey = CryptoJS.enc.Utf8.parse(KEY.substring(0, 32));

    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        parsedKey,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    const combined = iv.clone().concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
}