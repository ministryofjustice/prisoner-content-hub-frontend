class InMemoryCachingStrategy {
  constructor() {
    this.state = {};
  }

  async set(key, value, expiresInSeconds) {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiresInSeconds);
    this.state[key] = { value, expires };
  }

  async get(key) {
    const now = new Date();
    const { value, expires } = this.state[key] || {};
    if (value && now >= expires) {
      return null;
    }
    return value;
  }
}
module.exports = { InMemoryCachingStrategy };
