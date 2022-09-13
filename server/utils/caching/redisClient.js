const { createClient } = require('redis');
const encryption = require('../encryption');
const { redis: redisConfig } = require('../../config');
const logger = require('../logger');

const url =
  redisConfig.tls_enabled === 'true'
    ? `rediss://${redisConfig.host}:${redisConfig.port}`
    : `redis://${redisConfig.host}:${redisConfig.port}`;

class RedisCachingStrategy {
  constructor(secret) {
    const { encrypt, decrypt } = encryption(secret);
    this.encrypt = encrypt;
    this.decrypt = decrypt;
    this.client = createClient({
      url,
      password: redisConfig.password,
      socket: {
        reconnectStrategy: attempts => {
          // Exponential back off: 20ms, 40ms, 80ms..., capped to retry every 30 seconds
          const nextDelay = Math.min(2 ** attempts * 20, 30000);
          logger.info(
            `Retry Redis connection attempt: ${attempts}, next attempt in: ${nextDelay}ms`,
          );
          return nextDelay;
        },
      },
    });
    this.client.on('error', e => logger.error('Redis client error', e));
  }

  async #ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async set(key, value, expiresInSeconds) {
    if (!key || !value || !expiresInSeconds) {
      throw new Error('Unable to cache - key, value or expiry not provided');
    }
    await this.#ensureConnected();
    await this.client.set(key, JSON.stringify(value), 'EX', expiresInSeconds);
  }

  async get(key) {
    if (!key) {
      throw new Error('Unable to retrieve cache - key not provided');
    }
    await this.#ensureConnected();
    const value = await this.client.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  }
}

module.exports = RedisCachingStrategy;
