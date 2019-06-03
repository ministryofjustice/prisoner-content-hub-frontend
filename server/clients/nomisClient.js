const request = require('superagent');
const config = require('../config');
const logger = require('../../log');

class NomisClient {
  constructor(client = request) {
    this.client = client;
    this.authToken = null;
  }

  getAuthToken() {
    return this.client
      .post(config.nomis.api.auth)
      .set('Authorization', `Basic ${config.nomis.clientToken}`)
      .set('Accept', 'application/json')
      .set('Content-Length', 0)
      .then(res => {
        logger.debug(`Requested ${config.nomis.api.auth}`);
        this.authToken = res.body;
        return res.body;
      });
  }

  async makeGetRequest(url) {
    try {
      const res = await this.client
        .get(url)
        .set('Authorization', `Bearer ${this.authToken.access_token}`)
        .set('Accept', 'application/json');
      logger.debug(`Requested ${url}`);
      return res.body;
    } catch (exp) {
      if (exp.status === 401) {
        this.authToken = null;
      }
      logger.debug(`Failed to request ${url}`);
      logger.error(exp);
      return null;
    }
  }

  async get(url) {
    if (!this.authToken) {
      await this.getAuthToken();
    }

    return this.makeGetRequest(url);
  }
}

module.exports = NomisClient;
