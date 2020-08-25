const nock = require('nock');
const {
  PrisonApiClient,
  PRISON_API_TOKEN_KEY,
  CACHE_EXPIRY_OFFSET,
} = require('../../server/clients/prisonApiClient');

const BASIC_AUTH_HEADER = 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0';
const CLIENT_ID = 'clientId';
const CLIENT_SECRET = 'clientSecret';
const AUTH_URL = 'http://auth.foo.bar/oauth';
const PRISON_API_CONFIG = {
  auth: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    authUrl: AUTH_URL,
  },
};

describe('PrisonApiClient', () => {
  const testCacheStrategy = {
    set: sinon.spy(),
    get: sinon.stub(),
  };

  beforeEach(() => {
    testCacheStrategy.set.resetHistory();
    testCacheStrategy.get.resetHistory();
  });

  it('should throw if not passed an authentication URL', () => {
    expect(() => {
      new PrisonApiClient({
        prisonApi: {
          auth: {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            authUrl: null,
          },
        },
      });
    }).to.throw(/authUrl/i);
  });

  describe('.basicAuthFrom', () => {
    it('should generate a basic auth token', () => {
      const client = new PrisonApiClient({
        prisonApi: PRISON_API_CONFIG,
      });

      client.setBasicAuthToken(CLIENT_ID, CLIENT_SECRET);

      expect(client).to.have.property('basicAuthToken');
    });

    it('should throw when supplied incorrect arguments', () => {
      const client = new PrisonApiClient({
        prisonApi: PRISON_API_CONFIG,
      });

      expect(() => {
        client.setBasicAuthToken();
      }).to.throw(/unable to encode/i);
    });
  });

  describe('.requestNewAccessToken', () => {
    it('should fetch a new access token and store in cache', async () => {
      const client = new PrisonApiClient({
        cachingStrategy: testCacheStrategy,
        prisonApi: PRISON_API_CONFIG,
      });

      nock('http://auth.foo.bar')
        .post(/oauth/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).to.equal(BASIC_AUTH_HEADER);
          expect(this.req.headers.accept).to.equal('application/json');
          return { access_token: 'foo.bar.baz', expires_in: 60 };
        });

      const token = await client.requestNewAccessToken();

      expect(testCacheStrategy.set.called).to.equal(
        true,
        'It should have stored the access token',
      );
      expect(testCacheStrategy.set).to.have.been.calledWith(
        PRISON_API_TOKEN_KEY,
        'foo.bar.baz',
        60 - CACHE_EXPIRY_OFFSET,
      );
      expect(token).to.equal('foo.bar.baz');
    });

    it('should throw when a request for a new token fails', async () => {
      const client = new PrisonApiClient({
        cachingStrategy: testCacheStrategy,
        prisonApi: PRISON_API_CONFIG,
      });

      nock('http://auth.foo.bar')
        .post(/oauth/)
        .reply(401, function request() {
          expect(this.req.headers.authorization).to.equal(
            BASIC_AUTH_HEADER,
            'It should have sent a Basic Auth request',
          );
          expect(this.req.headers.accept).to.equal('application/json');
          return {};
        });

      await expect(client.requestNewAccessToken()).to.be.rejectedWith(/401/);
    });

    it('should throw when a request for a new token returns a bad response', async () => {
      const client = new PrisonApiClient({
        cachingStrategy: testCacheStrategy,
        prisonApi: PRISON_API_CONFIG,
      });

      nock('http://auth.foo.bar')
        .post(/oauth/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).to.equal(
            BASIC_AUTH_HEADER,
            'It should have sent a Basic Auth request',
          );
          expect(this.req.headers.accept).to.equal('application/json');
          return {};
        });

      await expect(client.requestNewAccessToken()).to.be.rejectedWith(
        /malformed response/i,
      );
    });
  });

  describe('.get', () => {
    it('should request an access token on cache miss', async () => {
      const client = new PrisonApiClient({
        cachingStrategy: testCacheStrategy,
        prisonApi: PRISON_API_CONFIG,
      });

      testCacheStrategy.get.resolves(null);

      nock('http://auth.foo.bar')
        .post(/oauth/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).to.equal(
            BASIC_AUTH_HEADER,
            'It should have sent a Basic Auth request',
          );
          expect(this.req.headers.accept).to.equal('application/json');
          return { access_token: 'foo.bar.baz', expires_in: 60 };
        });

      nock('http://api.foo.bar')
        .get(/baz/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).to.equal(
            'Bearer foo.bar.baz',
            'It should have sent a bearer token',
          );
          expect(this.req.headers.accept).to.equal('application/json');
          return { foo: 'bar' };
        });

      const response = await client.get('http://api.foo.bar/baz');

      expect(response.foo).to.equal('bar');
    });

    it('should not request an access token if one is cached', async () => {
      const client = new PrisonApiClient({
        cachingStrategy: testCacheStrategy,
        prisonApi: PRISON_API_CONFIG,
      });

      testCacheStrategy.get.resolves('foo.bar.baz');

      nock('http://api.foo.bar')
        .get(/baz/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).to.equal(
            'Bearer foo.bar.baz',
            'It should have sent a bearer token',
          );
          expect(this.req.headers.accept).to.equal('application/json');
          return { foo: 'bar' };
        });

      const response = await client.get('http://api.foo.bar/baz');

      expect(response.foo).to.equal('bar');
    });
  });
});
