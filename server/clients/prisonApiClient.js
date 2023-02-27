const { path, pathOr } = require('ramda');
const { baseClient } = require('./baseClient');
const { logger } = require('../utils/logger');
const { InMemoryCachingStrategy } = require('../utils/caching/memory');

const PRISON_API_TOKEN_KEY = 'prisonApi:bearerToken';
const CACHE_EXPIRY_OFFSET = 60; // Seconds

class PrisonApiClient {
  constructor(options = {}) {
    const { clientId, clientSecret, authUrl } = pathOr(
      {},
      ['prisonApi', 'auth'],
      options,
    );

    if (!authUrl) {
      throw new Error('Unable to create PrisonApiClient, authUrl not set');
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
      `PrisonApiClient - Requested new access token from ${this.authUrl}`,
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
      PRISON_API_TOKEN_KEY,
      token,
      expiresIn - CACHE_EXPIRY_OFFSET,
    );

    return token;
  }

  async get(url, additionalHeaders) {
    logger.debug(`PrisonApiClient (GET) - ${url}`);

    let token = await this.cache.get(PRISON_API_TOKEN_KEY);

    if (!token) {
      token = await this.requestNewAccessToken();
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...additionalHeaders,
    };

    const response = await this.client({
      method: 'GET',
      url,
      headers,
    });

    return response.data;
  }
}

module.exports = {
  PRISON_API_TOKEN_KEY,
  CACHE_EXPIRY_OFFSET,
  PrisonApiClient,
};
