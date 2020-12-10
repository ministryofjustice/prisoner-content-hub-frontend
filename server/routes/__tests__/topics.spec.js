const request = require('supertest');
const cheerio = require('cheerio');

const { createTopicsRouter } = require('../topics');
const {
  setupBasicApp,
  consoleLogError,
} = require('../../../test/test-helpers');

describe('GET /topics', () => {
  let hubMenuService;
  let router;
  let app;

  beforeEach(() => {
    hubMenuService = {
      allTopics: jest.fn().mockReturnValue([
        { linkText: 'foo', href: '/content/foo' },
        { linkText: 'bar', href: '/content/bar' },
      ]),
    };
  });

  describe('Topics', () => {
    beforeEach(() => {
      router = createTopicsRouter({ hubMenuService });

      app = setupBasicApp();
      app.use((req, res, next) => {
        req.session = {};
        next();
      });
      app.use(router);
      app.use(consoleLogError);
    });

    it('has a search bar', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#search-wrapper').length).toBe(1);
        }));

    it('renders a list of tags', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const topics = $('.hub-topics dl dt');
          expect(topics.length).toBe(
            2,
            'The full list of topics should be rendered to the page',
          );
          expect(topics.first().find('a').text()).toContain(
            'foo',
            'The correct topic label should be rendered',
          );
          expect(topics.first().find('a').attr('href')).toContain(
            '/content/foo',
            'The correct topic link should be rendered',
          );
        }));
  });
});
