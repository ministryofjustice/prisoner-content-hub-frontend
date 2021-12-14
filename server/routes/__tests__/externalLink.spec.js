const request = require('supertest');
const cheerio = require('cheerio');

jest.mock('@sentry/node');

const { createExternalLinkRouter } = require('../externalLink');
const { setupBasicApp } = require('../../../test/test-helpers');

describe('GET /external-link', () => {
  describe('/:id', () => {
    describe('on error', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('passes caught exceptions to next', async () => {
        const cmsService = {
          getTag: jest.fn().mockRejectedValue('💥'),
        };
        const router = createExternalLinkRouter({ cmsService });
        const app = setupBasicApp();

        app.use('/external-link', router);

        await request(app).get('/external-link/1').expect(500);
      });
      it('returns a 500 when incorrect data is returned', async () => {
        const cmsService = {
          getTag: jest.fn().mockRejectedValue('error'),
        };
        const router = createExternalLinkRouter({ cmsService });
        const app = setupBasicApp();

        app.use('/external-link', router);

        await request(app).get('/external-link/1').expect(500);
      });
    });

    describe('on success', () => {
      const data = {
        title: 'foo bar',
        url: 'foo.url.com',
      };

      const getSessionMiddleware = cookie => (req, res, next) => {
        req.session = {
          establishmentId: 123,
          establishmentName: 'berwyn',
        };
        req.headers.cookie = cookie;
        next();
      };

      let app;
      let router;

      beforeEach(() => {
        const cmsService = {
          getExternalLink: jest.fn().mockReturnValue(data),
        };
        router = createExternalLinkRouter({ cmsService });
        app = setupBasicApp();
      });

      describe('external link with the cookie', () => {
        it('redirects to the external link', () => {
          app.use(getSessionMiddleware(`externalLink_${data.url}=true`));
          app.use('/external-link', router);
          return request(app)
            .get('/external-link/1')
            .expect('Location', data.url);
        });
      });

      describe('external link with no cookie', () => {
        beforeEach(() => {
          app.use(getSessionMiddleware(''));
          app.use('/external-link', router);
        });
        it('correctly renders the external link page text', () =>
          request(app)
            .get('/external-link/1')
            .then(response => {
              const $ = cheerio.load(response.text);
              expect($('[data-test="external-link-content"]').text()).toContain(
                `You are being taken to foo bar. You are allowed to visit this website.`,
              );
            }));
        it('correctly renders the external link page link', () =>
          request(app)
            .get('/external-link/1')
            .then(response => {
              const $ = cheerio.load(response.text);
              expect($('.govuk-button')[0].attribs.href).toEqual(data.url);
            }));
      });
    });
  });
});
