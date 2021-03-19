const Sentry = require('@sentry/node');

jest.mock('@sentry/node');

const nock = require('nock');
const { StandardClient } = require('../standard');

describe('StandardClient', () => {
  beforeAll(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('.get', () => {
    it('makes a request simple GET request', async () => {
      nock('https://some-api.com').get('/').reply(200, ['SOME_DATA']);

      const client = new StandardClient();
      const result = await client.get('https://some-api.com');

      expect(result).toStrictEqual(['SOME_DATA']);
    });

    it('makes a request simple GET request with a query', async () => {
      let reqPath;
      nock('https://some-api.com')
        .get('/')
        .query(true)
        .reply(200, function request() {
          reqPath = this.req.path;
          return ['SOME_FOO_BAR_DATA'];
        });

      const client = new StandardClient();
      const result = await client.get('https://some-api.com', {
        query: {
          foo: 'bar',
        },
      });

      expect(reqPath).toContain('foo=bar');
      expect(result).toStrictEqual(['SOME_FOO_BAR_DATA']);
    });

    it('returns an null when the request fails', async () => {
      nock('https://some-api.com').get('/bar').reply(404, ['SOME_DATA']);

      const client = new StandardClient();
      const result = await client.get('https://some-api.com/bar');

      expect(Sentry.captureException).toHaveBeenCalledWith(
        new Error('Request failed with status code 404'),
      );
      expect(result).toStrictEqual(null);
    });
  });

  describe('.post', () => {
    it('posts data to an endpoint', async () => {
      nock('https://www.example.com')
        .post('/foo', { foo: 'bar' })
        .reply(200, { id: '123ABC' });

      const client = new StandardClient();
      const result = await client.post('https://www.example.com/foo', {
        foo: 'bar',
      });

      expect(result).toStrictEqual({ id: '123ABC' });
    });

    it('returns null when the request fails', async () => {
      nock('https://www.example.com')
        .post('/bar', { foo: 'bar' })
        .reply(400, { id: '123ABC' });

      const client = new StandardClient();
      const result = await client.post('https://www.example.com/bar', {
        foo: 'bar',
      });
      expect(Sentry.captureException).toHaveBeenCalledWith(
        new Error('Request failed with status code 404'),
      );
      expect(Sentry.captureException).toHaveBeenCalledWith(
        new Error('Request failed with status code 400'),
      );
      expect(result).toStrictEqual(null);
    });
  });
});
