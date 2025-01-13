const { baseClient } = require('./baseClient');
const { logger } = require('../utils/logger');
const { InMemoryCachingStrategy } = require('../utils/caching/memory');

const ADJUDICATIONS_API_TOKEN_KEY = 'adjudicationsApi:bearerToken';
const CACHE_EXPIRY_OFFSET = 60; // Seconds

class AdjudicationsApiClient {
  constructor(options = {}) {
    const { clientId, clientSecret, authUrl } =
      options?.adjudicationsApi?.auth ?? {};

    if (!authUrl) {
      throw new Error(
        'Unable to create adjudicationsApiClient, authUrl not set',
      );
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
      `adjudicationsApiClient - Requested new access token from ${this.authUrl}`,
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
      const responseStatus = error?.response?.status;
      throw new Error(`Failed to request access token - ${responseStatus}`);
    }

    const token = response?.data?.access_token;
    const expiresIn = response?.data?.expires_in;

    if (!token || !expiresIn) {
      throw new Error('Failed to request access token - malformed response');
    }

    await this.cache.set(
      ADJUDICATIONS_API_TOKEN_KEY,
      token,
      expiresIn - CACHE_EXPIRY_OFFSET,
    );

    return token;
  }

  async get(url) {
    logger.debug(`adjudicationsApiClient (GET) - ${url}`);

    let token = await this.cache.get(ADJUDICATIONS_API_TOKEN_KEY);

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
  ADJUDICATIONS_API_TOKEN_KEY,
  CACHE_EXPIRY_OFFSET,
  AdjudicationsApiClient,
};
