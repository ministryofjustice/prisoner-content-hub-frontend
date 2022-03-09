const request = require('supertest');
const cheerio = require('cheerio');
const {
  testApp: { setupApp, cookieSupplier },
} = require('../../../test/test-helpers');

jest.mock('@sentry/node');

describe('GET /link', () => {
  const data = {
    title: 'foo bar',
    url: 'foo.url.com',
    intercept: true,
  };

  const cmsService = { getLink: jest.fn() };

  let app;

  beforeEach(() => {
    jest.resetAllMocks();
    app = setupApp({ cmsService });
    cmsService.getLink.mockResolvedValue(data);
  });

  describe('/:id', () => {
    describe('on error', () => {
      it('passes caught exceptions to next', async () => {
        cmsService.getLink.mockRejectedValue('error');
        await request(app).get('/link/1').expect(500);
      });
    });

    describe('on success', () => {
      describe('external link with the cookie', () => {
        it('redirects to the external link', async () => {
          cookieSupplier.mockReturnValue(`externalLink_${data.url}=true`);
          await request(app).get('/link/1').expect('Location', data.url);
        });
      });

      describe('external link without cookie and no intercept', () => {
        it('redirects to the external link', async () => {
          cookieSupplier.mockReturnValue(``);
          cmsService.getLink.mockResolvedValue({
            title: 'foo bar',
            url: 'foo.url.com',
            intercept: false,
          });
          await request(app).get('/link/1').expect('Location', data.url);
        });
      });

      describe('external link with no cookie', () => {
        it('correctly renders the external link page text', async () => {
          cookieSupplier.mockReturnValue(``);
          await request(app)
            .get('/link/1')
            .then(response => {
              const $ = cheerio.load(response.text);
              expect($('[data-test="external-link-content"]').text()).toContain(
                `You are being taken to foo bar. You are allowed to visit this website.`,
              );
            });
        });

        it('correctly renders the external link page link', async () => {
          cookieSupplier.mockReturnValue(``);
          await request(app)
            .get('/link/1')
            .then(response => {
              const $ = cheerio.load(response.text);
              expect($('.govuk-button')[0].attribs.href).toEqual(data.url);
            });
        });
      });
    });
  });
});
