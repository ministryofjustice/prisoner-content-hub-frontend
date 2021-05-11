const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');
const { logger } = require('../utils/logger');

class JsonApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      adapter: httpAdapter,
    });
    this.client.interceptors.request.use(request => {
      logger.info(
        `JsonApiClient [${request.method}] request - ${request.baseURL}${request.url}`,
      );
      return request;
    });

    this.client.interceptors.response.use(res => {
      logger.info(
        `JsonApiClient [${res.config?.method}], status: ${res.status} response - ${res.config?.baseURL}${res.config?.url}`,
      );
      return res;
    });
  }

  async get(path, { query } = {}) {
    const res = await this.client.get(path, { params: query });
    return res.data;
  }
}

module.exports = {
  JsonApiClient,
};
