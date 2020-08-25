class InMemoryCachingStrategy {
  constructor() {
    this.state = {};
  }

  async set(key, value, expiresInSeconds) {
    if (!key || !value || !expiresInSeconds) {
      throw new Error('Unable to cache - key, value or expiry not provided');
    }
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiresInSeconds);
    this.state[key] = { value, expires };
  }

  async get(key) {
    if (!key) {
      throw new Error('Unable to retrieve cache - key not provided');
    }
    const now = new Date();
    const { value, expires } = this.state[key] || {};
    if (value && now >= expires) {
      return null;
    }
    return value;
  }
}
module.exports = { InMemoryCachingStrategy };
