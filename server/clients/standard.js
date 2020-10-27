const qs = require('querystring');
const { path } = require('ramda');
const { baseClient } = require('./baseClient');
const { logger } = require('../utils/logger');
const { InMemoryCachingStrategy } = require('../utils/caching');

class StandardClient {
  constructor(client = baseClient) {
    this.client = client;
    this.cache = new InMemoryCachingStrategy();
  }

  async get(endpoint, { query, ...rest } = {}) {
    const cacheId = `${endpoint}?${qs.stringify(query)}`;
    const cached = await this.cache.get(cacheId);

    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const res = await this.client.get(endpoint, {
        params: query,
        ...rest,
      });
      logger.info(`StandardClient (GET) - ${cacheId}`);
      await this.cache.set(cacheId, JSON.stringify(res.data), 300);
      return res.data;
    } catch (e) {
      logger.error(`StandardClient (GET) - Failed: ${e.message}`);
      logger.debug(e.stack);
      return null;
    }
  }

  post(endpoint, data) {
    return this.client
      .post(endpoint, data)
      .then(res => {
        logger.info(`StandardClient (POST) ${endpoint}`);
        return res.data;
      })
      .catch(e => {
        logger.error(`StandardClient (POST) - Failed: ${e.message}`);
        logger.debug(e.stack);
        return null;
      });
  }

  postFormData(endpoint, data) {
    const querystring = qs.stringify(data);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const userAgent = path(['userAgent'], data);

    if (userAgent) {
      headers['User-Agent'] = userAgent;
    }

    return this.client
      .post(endpoint, querystring, {
        headers,
      })
      .then(res => {
        logger.info(
          `StandardClient (POST URLENCODED) - ${endpoint}?${querystring}`,
        );
        return res.data;
      })
      .catch(e => {
        logger.error(`StandardClient (POST URLENCODED) - Failed: ${e.message}`);
        logger.debug(e.stack);
        return null;
      });
  }
}

module.exports = {
  StandardClient,
};
