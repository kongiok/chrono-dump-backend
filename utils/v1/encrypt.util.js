
import pkg from 'argon2';
const argon2 = pkg;
import crypto from 'crypto';


export const encryptWithAES = (data, key, iv) => {
  const derivedKey = crypto.scryptSync(key, iv, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted.toString('hex');
};

export const decryptWithAES = (data, key, iv) => {
  const derivedKey = crypto.scryptSync(key, iv, 32);
  const keyIv = Buffer.from(iv, 'hex');
  const encryptedText = Buffer.from(data.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, keyIv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};


export const encryptWithArgon2 = async (data) => {
  const hash = await argon2.hash(data);
  return hash.encoded;
};

export const verifyWithArgon2 = async (encryptedData, data) => {
  if (!encryptedData || encryptedData.trim() === '') {
    console.error('Error verifying password: Encrypted data cannot be empty');
    return false;
  }

  if (!data || data.trim() === '') {
    console.error('Error verifying password: Data to be verified cannot be empty');
    return false;
  }

  if (await argon2.verify(encryptedData, data)) {
    return true;
  }
  return false;
};
