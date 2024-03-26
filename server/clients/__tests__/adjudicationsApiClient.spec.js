const nock = require('nock');
const {
  AdjudicationsApiClient,
  ADJUDICATIONS_API_TOKEN_KEY,
  CACHE_EXPIRY_OFFSET,
} = require('../adjudicationsApiClient');

const BASIC_AUTH_HEADER = 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0';
const CLIENT_ID = 'clientId';
const CLIENT_SECRET = 'clientSecret';
const AUTH_URL = 'http://auth.foo.bar/oauth';
const ADJUDICATIONS_API_CONFIG = {
  auth: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    authUrl: AUTH_URL,
  },
};

describe('AdjudicationsApiClient', () => {
  const testCacheStrategy = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(() => {
    testCacheStrategy.set.mockClear();
    testCacheStrategy.get.mockClear();
  });

  it('should throw if not passed an authentication URL', () => {
    expect(() => {
      new AdjudicationsApiClient({
        adjudicationsApi: {
          auth: {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            authUrl: null,
          },
        },
      });
    }).toThrow(/authUrl/i);
  });

  describe('.basicAuthFrom', () => {
    it('should generate a basic auth token', () => {
      const client = new AdjudicationsApiClient({
        adjudicationsApi: ADJUDICATIONS_API_CONFIG,
      });

      client.setBasicAuthToken(CLIENT_ID, CLIENT_SECRET);

      expect(client).toHaveProperty('basicAuthToken');
    });

    it('should throw when supplied incorrect arguments', () => {
      const client = new AdjudicationsApiClient({
        adjudicationsApi: ADJUDICATIONS_API_CONFIG,
      });

      expect(() => {
        client.setBasicAuthToken();
      }).toThrow(/unable to encode/i);
    });
  });

  describe('.requestNewAccessToken', () => {
    it('should fetch a new access token and store in cache', async () => {
      const client = new AdjudicationsApiClient({
        cachingStrategy: testCacheStrategy,
        adjudicationsApi: ADJUDICATIONS_API_CONFIG,
      });

      nock('http://auth.foo.bar')
        .post(/oauth/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).toEqual(BASIC_AUTH_HEADER);
          expect(this.req.headers.accept).toEqual('application/json');
          return { access_token: 'foo.bar.baz', expires_in: 60 };
        });

      const token = await client.requestNewAccessToken();

      expect(testCacheStrategy.set).toHaveBeenCalled();
      expect(testCacheStrategy.set).toHaveBeenCalledWith(
        ADJUDICATIONS_API_TOKEN_KEY,
        'foo.bar.baz',
        60 - CACHE_EXPIRY_OFFSET,
      );
      expect(token).toEqual('foo.bar.baz');
    });

    it('should throw when a request for a new token fails', async () => {
      const client = new AdjudicationsApiClient({
        cachingStrategy: testCacheStrategy,
        adjudicationsApi: ADJUDICATIONS_API_CONFIG,
      });

      nock('http://auth.foo.bar')
        .post(/oauth/)
        .reply(401, function request() {
          expect(this.req.headers.authorization).toEqual(
            BASIC_AUTH_HEADER,
            'It should have sent a Basic Auth request',
          );
          expect(this.req.headers.accept).toEqual('application/json');
          return {};
        });

      await expect(client.requestNewAccessToken()).rejects.toStrictEqual(
        new Error('Failed to request access token - 401'),
      );
    });

    it('should throw when a request for a new token returns a bad response', async () => {
      const client = new AdjudicationsApiClient({
        cachingStrategy: testCacheStrategy,
        adjudicationsApi: ADJUDICATIONS_API_CONFIG,
      });

      nock('http://auth.foo.bar')
        .post(/oauth/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).toEqual(
            BASIC_AUTH_HEADER,
            'It should have sent a Basic Auth request',
          );
          expect(this.req.headers.accept).toEqual('application/json');
          return {};
        });

      await expect(client.requestNewAccessToken()).rejects.toStrictEqual(
        new Error('Failed to request access token - malformed response'),
      );
    });
  });

  describe('.get', () => {
    it('should request an access token on cache miss', async () => {
      const client = new AdjudicationsApiClient({
        cachingStrategy: testCacheStrategy,
        adjudicationsApi: ADJUDICATIONS_API_CONFIG,
      });

      testCacheStrategy.get.mockResolvedValue(null);

      nock('http://auth.foo.bar')
        .post(/oauth/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).toEqual(
            BASIC_AUTH_HEADER,
            'It should have sent a Basic Auth request',
          );
          expect(this.req.headers.accept).toEqual('application/json');
          return { access_token: 'foo.bar.baz', expires_in: 60 };
        });

      nock('http://api.foo.bar')
        .get(/baz/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).toEqual(
            'Bearer foo.bar.baz',
            'It should have sent a bearer token',
          );
          expect(this.req.headers.accept).toEqual('application/json');
          return { foo: 'bar' };
        });

      const response = await client.get('http://api.foo.bar/baz');

      expect(response.foo).toEqual('bar');
    });

    it('should not request an access token if one is cached', async () => {
      const client = new AdjudicationsApiClient({
        cachingStrategy: testCacheStrategy,
        adjudicationsApi: ADJUDICATIONS_API_CONFIG,
      });

      testCacheStrategy.get.mockResolvedValue('foo.bar.baz');

      nock('http://api.foo.bar')
        .get(/baz/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).toEqual(
            'Bearer foo.bar.baz',
            'It should have sent a bearer token',
          );
          expect(this.req.headers.accept).toEqual('application/json');
          return { foo: 'bar' };
        });

      const response = await client.get('http://api.foo.bar/baz');

      expect(response.foo).toEqual('bar');
    });
  });
});
