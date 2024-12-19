const Sentry = require('@sentry/node');
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
        logger.debug(`StandardClient (GET) ${endpoint}?${qs.stringify(query)}`);
        return res.data;
      })
      .catch(e => {
        Sentry.captureException(e);
        logger.error(`StandardClient (GET) - Failed: ${e.message}`);
        logger.debug(e.stack);
        return null;
      });
  }

  post(endpoint, data) {
    return this.client
      .post(endpoint, data)
      .then(res => {
        logger.debug(`StandardClient (POST) ${endpoint}`);
        return res.data;
      })
      .catch(e => {
        Sentry.captureException(e);
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
    const userAgent = data?.userAgent;

    if (userAgent) {
      headers['User-Agent'] = userAgent;
    }

    return this.client
      .post(endpoint, querystring, {
        headers,
      })
      .then(res => {
        logger.debug(
          `StandardClient (POST URLENCODED) - ${endpoint}?${querystring}`,
        );
        return res.data;
      })
      .catch(e => {
        Sentry.captureException(e);
        logger.error(`StandardClient (POST URLENCODED) - Failed: ${e.message}`);
        logger.debug(e.stack);
        return null;
      });
  }
}

module.exports = {
  StandardClient,
};
