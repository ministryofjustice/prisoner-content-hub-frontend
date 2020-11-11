const request = require('supertest');
const cheerio = require('cheerio');

const { createContentRouter } = require('../content');
const { setupBasicApp } = require('../../../test/test-helpers');

const radioShowResponse = require('../../../test/resources/radioShowServiceResponse.json');
const videoShowResponse = require('../../../test/resources/videoShowServiceResponse.json');
const flatContentResponse = require('../../../test/resources/flatContentResponse.json');

describe('GET /content/:id', () => {
  it('returns a 404 when incorrect data is returned', () => {
    const invalidService = {
      contentFor: () => ({ type: 'invalid' }),
    };
    const router = createContentRouter({ hubContentService: invalidService });
    const app = setupBasicApp();

    app.use('/content', router);

    return request(app).get('/content/1').expect(404);
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

      const router = createContentRouter({
        hubContentService,
        analyticsService,
      });
      app = setupBasicApp();

      app.use('/content', router);
    });

    it('returns the correct content for a radio page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toBe(
            'Foo title',
            'Page title did not match',
          );
          expect($('#body').text()).toBe('Foo body', 'Page body did not match');
          expect($('#series').text()).toBe(
            'Foo series',
            'Page title did not match',
          );
          expect($('#hub-audio source').attr('src')).toBe(
            'foo.mp3',
            'Page media did not match',
          );
          expect($('#thumbnail').attr('src')).toBe(
            'foo.png',
            'Page thumbnail src did not match',
          );
          expect($('#thumbnail').attr('alt')).toBe(
            'foo Bar',
            'Page thumbnail alt did not match',
          );
        });
    });

    it('returns the correct tags for a radio page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#tags-list > li').length).toBe(2);
        });
    });

    it('returns the correct episodes for a radio page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#next-episodes a').length).toBe(
            1,
            "The number of next episodes shows don't match",
          );
          expect($('#next-episodes a').text()).toContain(
            'Foo episode',
            "The episode title doesn't match",
          );
          expect($('#episode-thumbnail').attr('style')).toContain(
            'foo.image.png',
            "The episode thumbnail doesn't match",
          );

          expect($('#next-episodes a').attr('href')).toContain(
            `/content/${radioShowResponse.season[0].id}`,
            'did not render url',
          );
        });
    });

    it('returns the correct suggestions for a radio page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#suggested-content a').length).toBe(1);
          expect($('#suggested-content h3').text()).toContain(
            'Suggested content',
            "The suggested content title doesn't match",
          );
        });
    });
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

      const router = createContentRouter({
        hubContentService,
        analyticsService,
      });
      app = setupBasicApp();

      app.use('/content', router);
    });

    it('returns the correct content for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toBe(
            'Baz title',
            'Page title did not match',
          );
          expect($('#body').text()).toBe('Baz body', 'Page body did not match');
          expect($('#series').text()).toBe(
            'Baz series',
            'Page title did not match',
          );
          expect($('#hub-video source').attr('src')).toBe(
            'baz.mp4',
            'Page media did not match',
          );
          expect($('#thumbnail').attr('src')).toBe(
            'baz.png',
            'Page thumbnail src did not match',
          );
          expect($('#thumbnail').attr('alt')).toBe(
            'baz Bar',
            'Page thumbnail alt did not match',
          );

          // tags
          expect($('#tags-list li').length).toBe(2);

          // episodes
          expect($('#next-episodes a').length).toBe(
            1,
            "The number of next episodes shows don't match",
          );
          expect($('#next-episodes a').text()).toContain(
            'Baz episode',
            "The episode title doesn't match",
          );
          expect($('#episode-thumbnail').attr('style')).toContain(
            'baz.image.png',
            "The episode thumbnail doesn't match",
          );

          expect($('#next-episodes a').attr('href')).toContain(
            `/content/${videoShowResponse.season[0].id}`,
            'did not render url',
          );

          // suggestions
          expect($('#suggested-content a').length).toBe(1);
          expect($('#suggested-content h3').text()).toContain(
            'Suggested content',
            "The suggested content title doesn't match",
          );
        });
    });

    it('returns the correct content for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toBe(
            'Baz title',
            'Page title did not match',
          );
          expect($('#body').text()).toBe('Baz body', 'Page body did not match');
          expect($('#series').text()).toBe(
            'Baz series',
            'Page title did not match',
          );
          expect($('#hub-video source').attr('src')).toBe(
            'baz.mp4',
            'Page media did not match',
          );
          expect($('#thumbnail').attr('src')).toBe(
            'baz.png',
            'Page thumbnail src did not match',
          );
          expect($('#thumbnail').attr('alt')).toBe(
            'baz Bar',
            'Page thumbnail alt did not match',
          );
        });
    });

    it('returns the correct tags for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#tags-list li').length).toBe(2);
        });
    });

    it('returns the correct episodes for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#next-episodes a').length).toBe(
            1,
            "The number of next episodes shows don't match",
          );
          expect($('#next-episodes a').text()).toContain(
            'Baz episode',
            "The episode title doesn't match",
          );
          expect($('#episode-thumbnail').attr('style')).toContain(
            'baz.image.png',
            "The episode thumbnail doesn't match",
          );

          expect($('#next-episodes a').attr('href')).toContain(
            `/content/${videoShowResponse.season[0].id}`,
            'did not render url',
          );
        });
    });

    it('returns the correct suggestions for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#suggested-content a').length).toBe(1);
          expect($('#suggested-content h3').text()).toContain(
            'Suggested content',
            "The suggested content title doesn't match",
          );
        });
    });
  });

  describe('Flat page content', () => {
    let app;

    beforeEach(() => {
      const hubContentService = {
        contentFor: jest.fn().mockReturnValue(flatContentResponse),
      };
      const analyticsService = {
        sendPageTrack: jest.fn(),
        sendEvent: jest.fn(),
      };
      const router = createContentRouter({
        hubContentService,
        analyticsService,
      });
      app = setupBasicApp();

      app.use('/content', router);
    });

    it('returns the correct content for a flat content page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).toContain(
            'The jobs noticeboard',
            'Page title did not match',
          );
          expect($('#stand-first').text()).toContain(
            'Some incredible foo stand first',
            'Article stand first did not match',
          );
          expect($('#body').text()).toContain(
            'Foo paragraph',
            'Article body did not match',
          );
        });
    });
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
      const router = createContentRouter({
        hubContentService,
        analyticsService,
      });
      const app = setupBasicApp();

      app.use('/content', router);

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
      const router = createContentRouter({
        hubContentService,
        analyticsService,
      });
      const app = setupBasicApp();

      app.use('/content', router);

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
