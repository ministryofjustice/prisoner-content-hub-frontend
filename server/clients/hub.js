const Sentry = require('@sentry/node');
const qs = require('querystring');
const { baseClient } = require('./baseClient');
const { logger } = require('../utils/logger');

class HubContentClient {
  constructor(client = baseClient) {
    this.client = client;
  }

  get(endpoint, { query, ...rest } = {}) {
    const queryString = {
      _format: 'json',
      _lang: 'en',
      ...query,
    };

    return this.client
      .get(endpoint, { params: queryString, ...rest })
      .then(res => {
        logger.info(
          `HubContentClient (GET) - ${endpoint}?${qs.stringify(queryString)}`,
        );
        return res.data;
      })
      .catch(e => {
        Sentry.captureException(e);
        logger.error(
          `HubContentClient (GET) - ${endpoint}?${qs.stringify(
            queryString,
          )} - Failed: ${e.message}`,
        );
        logger.debug(e.stack);
        return null;
      });
  }
}

module.exports = {
  HubClient: HubContentClient,
};
