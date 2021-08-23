const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');
const { logger } = require('../utils/logger');

class JsonApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      timeout: 30000,
      adapter: httpAdapter,
    });
    this.client.interceptors.request.use(request => {
      logger.info(`JsonApiClient [${request.method}] request - ${request.url}`);
      return request;
    });

    this.client.interceptors.response.use(res => {
      logger.info(
        `JsonApiClient [${res.config?.method}], status: ${res.status} response - ${res.config?.url}`,
      );
      return res;
    });
  }

  async getRelative(path, { query } = {}) {
    const res = await this.client.get(`${this.baseURL}${path}`, {
      params: query,
    });
    return res.data;
  }

  async getUrl(url, { query } = {}) {
    const res = await this.client.get(url, { params: query });
    return res.data;
  }
}

module.exports = {
  JsonApiClient,
};
