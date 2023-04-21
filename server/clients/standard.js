const Sentry = require('@sentry/node');
const querystring = require('node:querystring');

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
        logger.debug(`StandardClient (GET) ${endpoint}?${querystring.stringify(query)}`);
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
    const encodedPostData = querystring.stringify(data);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    if (data?.userAgent) {
      headers['User-Agent'] = data.userAgent;
    }

    return this.client
      .post(endpoint, encodedPostData, {
        headers,
      })
      .then(res => {
        logger.debug(
          `StandardClient (POST URLENCODED) - ${endpoint}?${encodedPostData}`,
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

  postWithQueryFormData(endpoint, queryParams, postData) {
    const encodedQueryString = querystring.stringify(queryParams)
    const fullEndpoint = `${endpoint}?${encodedQueryString}`

    const headers = {
      'Content-Type': 'application/json',
    };

    if (postData?.userAgent) {
      headers['User-Agent'] = postData.userAgent;
    }

    return this.client
      .post(fullEndpoint, postData, {
        headers,
      })
      .then(res => {
        logger.debug(
          `StandardClient (POST URLENCODED) - ${fullEndpoint}`,
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
