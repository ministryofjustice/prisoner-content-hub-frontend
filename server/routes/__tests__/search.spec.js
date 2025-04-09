const request = require('supertest');
const cheerio = require('cheerio');

const { createSearchRouter } = require('../search');
const {
  setupBasicApp,
  i18nextInitPromise,
} = require('../../../test/test-helpers');

const searchResponse = require('../../../test/resources/searchResponse.json');

describe('Search Spec', () => {
  let app;
  let analyticsService;
  beforeAll(async () => {
    await i18nextInitPromise;
  });
  beforeEach(() => {
    app = setupBasicApp();
    analyticsService = {
      sendPageTrack: jest.fn(),
      sendEvent: jest.fn(),
    };
  });
  describe('GET /search', () => {
    describe('Results page', () => {
      it('should return the correct number of search results', () => {
        const searchService = {
          find: jest.fn().mockReturnValue(searchResponse),
        };

        const router = createSearchRouter({
          searchService,
          analyticsService,
        });
        app.use('/search', router);

        const query = 'bob';

        return request(app)
          .get(`/search?query=${query}`)
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);

            expect($('.results > h3').text()).toContain(
              query,
              'The results header should contain the query',
            );

            const results = $('.results li');

            expect(results.length).toBe(
              searchResponse.length,
              'All results should be displayed on the page',
            );

            expect(results.text()).toContain(
              searchResponse[0].title,
              'The title of search results should be displayed',
            );

            expect(results.text()).toContain(
              searchResponse[0].summary,
              'The summary for search results should be displayed',
            );
          });
      });

      it('should display a message when no results found', () => {
        const searchService = {
          find: jest.fn().mockReturnValue([]),
        };

        const router = createSearchRouter({
          searchService,
          analyticsService,
        });

        app.use('/search', router);

        const query = 'qwertyuiop';

        return request(app)
          .get(`/search?query=${query}`)
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);

            expect($('.results > h3').text()).toContain(
              'No results found',
              'The results header should contain the query',
            );

            expect($('.results > h3').text()).toContain(
              query,
              'The results header should contain the query',
            );
          });
      });

      it('should display an error page when the search fails', () => {
        const searchService = {
          find: jest.fn().mockRejectedValue('BOOM!'),
        };

        const router = createSearchRouter({
          searchService,
          analyticsService,
        });

        app.use('/search', router);

        const query = 'bob';

        return request(app)
          .get(`/search?query=${query}`)
          .expect(500)
          .then(response => {
            const $ = cheerio.load(response.text);

            expect($('title').text().toLowerCase()).toContain(
              'error',
              'The error page should be displayed if the search fails',
            );
          });
      });
    });
  });

  describe('GET /suggest', () => {
    describe('Results page', () => {
      it('should return the correct number of search results', () => {
        const searchService = {
          typeAhead: jest.fn().mockReturnValue(searchResponse),
        };

        const router = createSearchRouter({
          searchService,
          analyticsService,
        });

        app.use('/search', router);

        const query = 'bob';

        return request(app)
          .get(`/search/suggest?query=${query}`)
          .expect(200)
          .then(response => {
            expect(Array.isArray(response.body)).toBe(
              true,
              'The endpoint should return an array of results',
            );

            expect(response.body.length).toBe(
              searchResponse.length,
              'All results should be returned in the response',
            );
          });
      });

      it('should return empty when the search fails', () => {
        const searchService = {
          find: jest.fn().mockRejectedValue('BOOM!'),
        };

        const router = createSearchRouter({
          searchService,
          analyticsService,
        });

        app.use('/search', router);

        const query = 'bob';

        return request(app)
          .get(`/search/suggest?query=${query}`)
          .expect(500)
          .then(response => {
            expect(Array.isArray(response.body)).toBe(
              true,
              'The response should be an array',
            );

            expect(response.body.length).toBe(
              0,
              'The response should be empty',
            );
          });
      });
    });
  });
});
