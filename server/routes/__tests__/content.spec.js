const request = require('supertest');
const cheerio = require('cheerio');

jest.mock('@sentry/node');

const { createContentRouter } = require('../content');
const { setupBasicApp } = require('../../../test/test-helpers');

const radioShowResponse = require('../../../test/resources/radioShowServiceResponse.json');
const videoShowResponse = require('../../../test/resources/videoShowServiceResponse.json');
const basicPageResponse = require('../../../test/resources/basicPageResponse.json');

const setupApp = services => {
  const router = createContentRouter(services);
  const app = setupBasicApp();

  app.use((req, res, next) => {
    req.session = {
      establishmentName: 'berwyn',
    };
    next();
  });

  app.use('/content', router);
  return app;
};
describe('GET /content/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes caught exceptions to next', async () => {
    const hubContentService = {
      contentFor: jest.fn().mockRejectedValue('💥'),
    };
    const app = setupApp({ hubContentService });

    await request(app).get('/content/1').expect(500);
  });
  it('returns a 404 when incorrect data is returned', async () => {
    const hubContentService = {
      contentFor: () => ({ type: 'invalid' }),
    };
    const app = setupApp({ hubContentService });

    await request(app).get('/content/1').expect(404);
  });

  describe('Radio page', () => {
    let app;

    beforeEach(() => {
      const hubContentService = {
        contentFor: jest.fn().mockReturnValue(radioShowResponse),
      };
      const analyticsService = {
        sendPageTrack: jest.fn(),
        sendEvent: jest.fn(),
      };

      app = setupApp({
        hubContentService,
        analyticsService,
      });
    });

    it('returns the correct content for a radio page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toBe('Foo title');
          expect($('#body').text()).toBe('Foo body');
          expect($('#series').text()).toBe('Foo series');
          expect($('#hub-audio source').attr('src')).toBe('foo.mp3');
          expect($('#thumbnail').attr('src')).toBe('foo.png');
          expect($('#thumbnail').attr('alt')).toBe('foo Bar');
        }));

    it('returns the correct tags for a radio page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#tags-list > li').length).toBe(2);
        }));

    it('returns the correct episodes for a radio page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#next-episodes a').length).toBe(1);
          expect($('#next-episodes a').text()).toContain('Foo episode');
          expect($('#episode-thumbnail').attr('style')).toContain(
            'foo.image.png',
          );

          expect($('#next-episodes a').attr('href')).toContain(
            `/content/${radioShowResponse.nextEpisodes[0].id}`,
          );
        }));

    it('returns the correct suggestions for a radio page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#suggested-content a').length).toBe(1);
          expect($('#suggested-content h3').text()).toContain(
            'Suggested content',
          );
        }));
  });

  describe('Video page', () => {
    let app;

    beforeEach(() => {
      const hubContentService = {
        contentFor: jest.fn().mockReturnValue(videoShowResponse),
      };
      const analyticsService = {
        sendPageTrack: jest.fn(),
        sendEvent: jest.fn(),
      };

      app = setupApp({
        hubContentService,
        analyticsService,
      });
    });

    it('returns the correct content for a video page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toBe('Baz title');
          expect($('#body').text()).toBe('Baz body');
          expect($('#series').text()).toBe('Baz series');
          expect($('#hub-video source').attr('src')).toBe('baz.mp4');
          expect($('#thumbnail').attr('src')).toBe('baz.png');
          expect($('#thumbnail').attr('alt')).toBe('baz Bar');

          // tags
          expect($('#tags-list li').length).toBe(2);

          // episodes
          expect($('#next-episodes a').length).toBe(1);
          expect($('#next-episodes a').text()).toContain('Baz episode');
          expect($('#episode-thumbnail').attr('style')).toContain(
            'baz.image.png',
          );

          expect($('#next-episodes a').attr('href')).toContain(
            `/content/${videoShowResponse.nextEpisodes[0].id}`,
          );

          // suggestions
          expect($('#suggested-content a').length).toBe(1);
          expect($('#suggested-content h3').text()).toContain(
            'Suggested content',
          );
        }));

    it('returns the correct content for a video page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toBe('Baz title');
          expect($('#body').text()).toBe('Baz body');
          expect($('#series').text()).toBe('Baz series');
          expect($('#hub-video source').attr('src')).toBe('baz.mp4');
          expect($('#thumbnail').attr('src')).toBe('baz.png');
          expect($('#thumbnail').attr('alt')).toBe('baz Bar');
        }));

    it('returns the correct tags for a video page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#tags-list li').length).toBe(2);
        }));

    it('returns the correct episodes for a video page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#next-episodes a').length).toBe(1);
          expect($('#next-episodes a').text()).toContain('Baz episode');
          expect($('#episode-thumbnail').attr('style')).toContain(
            'baz.image.png',
          );

          expect($('#next-episodes a').attr('href')).toContain(
            `/content/${videoShowResponse.nextEpisodes[0].id}`,
          );
        }));

    it('returns the correct suggestions for a video page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#suggested-content a').length).toBe(1);
          expect($('#suggested-content h3').text()).toContain(
            'Suggested content',
          );
        }));
  });

  describe('Basic page content', () => {
    let app;

    beforeEach(() => {
      const hubContentService = {
        contentFor: jest.fn().mockReturnValue(basicPageResponse),
      };
      const analyticsService = {
        sendPageTrack: jest.fn(),
        sendEvent: jest.fn(),
      };
      app = setupApp({
        hubContentService,
        analyticsService,
      });
    });

    it('returns the correct content for a basic content page', () =>
      request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toContain('The jobs noticeboard');
          expect($('#stand-first').text()).toContain(
            'Some incredible foo stand first',
          );
          expect($('#body').text()).toContain('Foo paragraph');
        }));
  });

  describe('Pdf pages', () => {
    const hubContentService = {
      contentFor: jest.fn().mockReturnValue({
        id: 1,
        title: 'foo pdf file',
        contentType: 'pdf',
        url: 'www.foo.bar/file.pdf',
      }),
    };
    const analyticsService = {
      sendPageTrack: jest.fn(),
      sendEvent: jest.fn(),
    };

    it('returns a PDF', () => {
      const app = setupApp({
        hubContentService,
        analyticsService,
      });

      return request(app)
        .get('/content/1')
        .expect(303)
        .expect('Location', 'www.foo.bar/file.pdf');
    });
  });

  describe('Landing page', () => {
    const serviceResponse = {
      id: 1,
      title: 'Foo Landing page',
      contentType: 'landing-page',
      description: {
        sanitized: '<p>Foo landing page body</p>',
        summary: 'Some summary',
      },
      featuredContent: {
        id: 'foo-id',
        title: 'foo-feature-title',
        description: { summary: 'foo-feature-summary' },
        contentType: 'landing-page',
        graphic: {
          url: '',
        },
      },
      categoryFeaturedContent: {
        contentType: 'foo',
        data: [
          {
            id: 'baz-id',
            title: 'baz-feature-title',
            description: { summary: 'baz-feature-summary' },
            contentType: 'radio-show',
            graphic: {
              url: '',
            },
            contentUrl: '/content/baz-id',
          },
          {
            id: 'bar-id',
            title: 'bar-feature-title',
            description: { summary: 'bar-feature-summary' },
            contentType: 'radio-show',
            graphic: {
              url: '',
            },
            contentUrl: '/content/bar-id',
          },
        ],
      },
      categoryMenu: [
        { linkText: 'Foo', href: '/content/1', id: '1' },
        { linkText: 'Bar', href: '/content/2', id: '2' },
      ],
    };

    it('returns the correct content for a landing page', () => {
      const hubContentService = {
        contentFor: jest.fn().mockReturnValue(serviceResponse),
      };
      const analyticsService = {
        sendPageTrack: jest.fn(),
        sendEvent: jest.fn(),
      };
      const app = setupApp({
        hubContentService,
        analyticsService,
      });

      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toContain(
            'Foo Landing page',
            'Page title did not match',
          );
          expect($('.category-content a').length).toBe(
            2,
            'it did not render the correct number of related items',
          );
          expect($('.help-block a').length).toBe(
            2,
            'show have rendered a category menu',
          );

          expect($('[data-featured-id="baz-id"]').attr('href')).toContain(
            `/content/baz-id`,
            'did not render url',
          );
        });
    });
  });
});
