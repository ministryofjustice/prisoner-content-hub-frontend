const qs = require('querystring');
const { baseClient } = require('./baseClient');
const { logger } = require('../utils/logger');
const { InMemoryCachingStrategy } = require('../utils/caching');

class HubContentClient {
  constructor(client = baseClient) {
    this.cache = new InMemoryCachingStrategy();
    this.client = client;
  }

  async get(endpoint, { query, ...rest } = {}) {
    const queryString = {
      _format: 'json',
      _lang: 'en',
      ...query,
    };
    const cacheId = `${endpoint}?${qs.stringify(queryString)}`;
    const cached = await this.cache.get(cacheId);

    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const res = await this.client.get(endpoint, {
        params: queryString,
        ...rest,
      });
      logger.info(`HubContentClient (GET) - ${cacheId}`);
      await this.cache.set(cacheId, JSON.stringify(res.data), 300);
      return res.data;
    } catch (e) {
      logger.error(`HubContentClient (GET) - Failed: ${e.message}`);
      logger.debug(e.stack);
      return null;
    }
  }
}

module.exports = {
  HubClient: HubContentClient,
};
