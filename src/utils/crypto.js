import CryptoJS from 'crypto-js';

export default {
  encryptData(key, data) {
    return CryptoJS.AES.encrypt(data, key).toString()
  },
  decryptData(key, data) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
  },
};
