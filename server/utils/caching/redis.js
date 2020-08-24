const { promisify } = require('util');
const encryption = require('../encryption');

class RedisCachingStrategy {
  constructor(secret, client) {
    const { encrypt, decrypt } = encryption(secret);
    this.encrypt = encrypt;
    this.decrypt = decrypt;
    this.getFromRedis = promisify(client.get).bind(client);
    this.setInRedis = promisify(client.set).bind(client);
  }

  async set(key, value, expiresInSeconds) {
    await this.setInRedis(key, this.encrypt(value), 'EX', expiresInSeconds);
  }

  async get(key) {
    const token = await this.getFromRedis(key);
    if (!token) {
      return null;
    }
    return this.decrypt(token);
  }
}

module.exports = { RedisCachingStrategy };
