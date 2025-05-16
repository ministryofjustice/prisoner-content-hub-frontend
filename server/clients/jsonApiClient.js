const axios = require('axios');
const { logger } = require('../utils/logger');

class JsonApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      timeout: 30000,
    });
    this.client.interceptors.request.use(request => {
      logger.debug(
        `JsonApiClient [${request.method}] request - ${request.url}`,
      );
      return request;
    });

    this.client.interceptors.response.use(res => {
      logger.debug(
        `JsonApiClient [${res.config?.method}], status: ${res.status} response - ${res.config?.url}`,
      );
      return res;
    });
  }

  async getRelative(path, { query } = {}) {
    const res = await this.client.get(`${this.baseURL}${path}`, {
      params: query,
    });
    logger.debug(
      `Cache ${res.headers['x-drupal-cache']} for path ${this.baseURL}${path}`,
    );

    return res.data;
  }

  async getUrl(url, { query } = {}) {
    const res = await this.client.get(url, { params: query });
    logger.debug(`Cache ${res.headers['x-drupal-cache']} for url ${url}`);

    return res.data;
  }
}

module.exports = {
  JsonApiClient,
};
