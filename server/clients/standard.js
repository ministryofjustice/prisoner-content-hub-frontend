const qs = require('querystring');
const { baseClient } = require('./baseClient');
const { logger } = require('../utils/logger');

class StandardClient {
  constructor(client = baseClient) {
    this.client = client;
  }

  get(endpoint, { query, ...rest } = {}) {
    return this.client
      .get(endpoint, { params: query, ...rest })
      .then(res => {
        logger.info(`StandardClient (GET) ${endpoint}?${qs.stringify(query)}`);
        return res.data;
      })
      .catch(e => {
        logger.error(`StandardClient (GET) - Failed: ${e.message}`);
        logger.debug(e.stack);
        return null;
      });
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
}

module.exports = {
  StandardClient,
};
