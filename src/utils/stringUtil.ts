export function isEmpty(value: string | null | undefined) {
  if (
    value === undefined ||
    value === null ||
    value === 'undefined' ||
    value === 'null' ||
    value === ''
  ) {
    return true;
  }
  return false;
}

export function isNotEmpty(value: string | null | undefined) {
  return !isEmpty(value);
}

export function guid() {
  return 'xxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 12) | 0;
    //   v = c == 'x' ? r : (r & 0x3) | 0x8;
    // return v.toString(16);
    return r;
  });
}

export function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

import CryptoJS from 'crypto-js';

let iv = CryptoJS.enc.Latin1.parse('1234567890123456'); //16位初始向量
///对文件进行加密
export const encryption = (k: any, word: any) => {
  let key = CryptoJS.enc.Utf8.parse(k); //为了避免补位，直接用16位的秘钥

  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};
///对文件进行解密
export const Decrypt = (k: any, word: any) => {
  let key = CryptoJS.enc.Utf8.parse(k);
  let decrypt = CryptoJS.AES.decrypt(word, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};
