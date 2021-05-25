const request = require('supertest');
const cheerio = require('cheerio');
const Sentry = require('@sentry/node');

jest.mock('@sentry/node');

const { createTopicsRouter } = require('../topics');
const {
  setupBasicApp,
  consoleLogError,
} = require('../../../test/test-helpers');

describe('GET /topics', () => {
  describe('Topics', () => {
    const topicsService = {
      getTopics: jest.fn(),
    };
    const sessionProvider = jest.fn();

    const router = createTopicsRouter({ topicsService });

    const app = setupBasicApp();

    beforeEach(() => {
      jest.clearAllMocks();

      sessionProvider.mockReturnValue({
        establishmentId: 123,
        establishmentName: 'berwyn',
      });

      app.use((req, res, next) => {
        req.session = sessionProvider();
        next();
      });
      app.use('/topics', router);
      app.use(consoleLogError);

      topicsService.getTopics.mockReturnValue([
        { linkText: 'foo', href: '/content/foo' },
        { linkText: 'bar', href: '/content/bar' },
      ]);
    });

    it('passes exceptions to Sentry', async () => {
      topicsService.getTopics.mockRejectedValue('💥');
      await request(app).get('/topics').expect(500);
      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
    });

    it('has a search bar', () =>
      request(app)
        .get('/topics')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#search-wrapper').length).toBe(1);
        }));

    it('renders a list of tags', () =>
      request(app)
        .get('/topics')
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

    it('calls service with correct parameters', () =>
      request(app)
        .get('/topics')
        .expect(200)
        .then(() => {
          expect(topicsService.getTopics).toHaveBeenCalledWith('berwyn');
        }));

    it('Should error when no establishment present', () => {
      sessionProvider.mockReturnValue({});

      return request(app)
        .get('/topics')
        .expect(500)
        .then(() => {
          expect(topicsService.getTopics).not.toHaveBeenCalled();
        });
    });
  });
});
