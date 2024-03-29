const { path, pathOr } = require('ramda');
const { baseClient } = require('./baseClient');
const { logger } = require('../utils/logger');
const { InMemoryCachingStrategy } = require('../utils/caching/memory');

const INCENTIVES_API_TOKEN_KEY = 'incentivesApi:bearerToken';
const CACHE_EXPIRY_OFFSET = 60; // Seconds

class IncentivesApiClient {
  constructor(options = {}) {
    const { clientId, clientSecret, authUrl } = pathOr(
      {},
      ['incentivesApi', 'auth'],
      options,
    );

    if (!authUrl) {
      throw new Error('Unable to create IncentivesApiClient, authUrl not set');
    }

    this.authUrl = authUrl;
    this.client = options.client || baseClient;
    this.cache = options.cachingStrategy || new InMemoryCachingStrategy();
    this.setBasicAuthToken(clientId, clientSecret);
  }

  setBasicAuthToken(clientId, clientSecret) {
    if (!clientId || !clientSecret) {
      throw new Error(
        'Unable to encode Basic Auth token, clientId or clientSecret not set',
      );
    }

    const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    this.basicAuthToken = `Basic ${token}`;
  }

  async requestNewAccessToken() {
    logger.info(
      `IncentivesApiClient - Requested new access token from ${this.authUrl}`,
    );
    let response;

    try {
      response = await this.client({
        url: this.authUrl,
        method: 'POST',
        headers: {
          Authorization: this.basicAuthToken,
          Accept: 'application/json',
          'Content-Length': 0,
        },
      });
    } catch (error) {
      const responseStatus = path(['response', 'status'], error);
      throw new Error(`Failed to request access token - ${responseStatus}`);
    }

    const token = path(['data', 'access_token'], response);
    const expiresIn = path(['data', 'expires_in'], response);

    if (!token || !expiresIn) {
      throw new Error('Failed to request access token - malformed response');
    }

    await this.cache.set(
      INCENTIVES_API_TOKEN_KEY,
      token,
      expiresIn - CACHE_EXPIRY_OFFSET,
    );

    return token;
  }

  async get(url) {
    logger.debug(`IncentivesApiClient (GET) - ${url}`);

    let token = await this.cache.get(INCENTIVES_API_TOKEN_KEY);

    if (!token) {
      token = await this.requestNewAccessToken();
    }

    const response = await this.client({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  }
}

module.exports = {
  INCENTIVES_API_TOKEN_KEY,
  CACHE_EXPIRY_OFFSET,
  IncentivesApiClient,
};
