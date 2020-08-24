const crypto = require('crypto');

const IV_LENGTH = 16;

module.exports = (secret, algorithm = 'aes-256-cbc') => ({
  encrypt: data => {
    if (!data) {
      throw new Error('No data passed to encrypt');
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  },
  decrypt: data => {
    if (!data) {
      throw new Error('No data passed to decrypt');
    }
    const [ivPart, encryptedData] = data.split(':');
    const iv = Buffer.from(ivPart, 'hex');
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secret),
      iv,
    );
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  },
});
