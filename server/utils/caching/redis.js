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
    if (!key || !value || !expiresInSeconds) {
      throw new Error('Unable to cache - key, value or expiry not provided');
    }
    await this.setInRedis(key, this.encrypt(value), 'EX', expiresInSeconds);
  }

  async get(key) {
    if (!key) {
      throw new Error('Unable to retrieve cache - key not provided');
    }
    const token = await this.getFromRedis(key);
    if (!token) {
      return null;
    }
    return this.decrypt(token);
  }
}

module.exports = { RedisCachingStrategy };
