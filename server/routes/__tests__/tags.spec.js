const request = require('supertest');
const cheerio = require('cheerio');
const Sentry = require('@sentry/node');

jest.mock('@sentry/node');

const { createTagRouter } = require('../tags');
const { setupBasicApp } = require('../../../test/test-helpers');

describe('GET /tags', () => {
  describe('/:id', () => {
    describe('on error', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('passes caught exceptions to Sentry', async () => {
        const hubTagsService = {
          termFor: jest.fn().mockRejectedValue('💥'),
        };
        const router = createTagRouter({ hubTagsService });
        const app = setupBasicApp();

        app.use('/tags', router);

        await request(app).get('/tags/1').expect(500);
        expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      });
      it('returns a 500 when incorrect data is returned', async () => {
        const hubTagsService = {
          termFor: jest.fn().mockRejectedValue('error'),
        };
        const router = createTagRouter({ hubTagsService });
        const app = setupBasicApp();

        app.use('/tags', router);

        await request(app).get('/tags/1').expect(500);
      });
    });

    describe('on success', () => {
      const data = {
        name: 'foo bar',
        description: {
          sanitized: 'foo description',
        },
        image: {
          alt: 'Foo Image',
          url: 'foo.url.com/image.png',
        },
        relatedContent: {
          contentType: 'foo',
          data: [
            {
              id: 'foo',
              type: 'radio',
              title: 'foo related content',
              summary: 'Foo body',
              image: {
                url: 'foo.png',
              },
              contentUrl: '/content/foo',
            },
          ],
        },
      };

      describe('tags page header', () => {
        it('correctly renders a page header with an image', () => {
          const hubTagsService = {
            termFor: jest.fn().mockReturnValue(data),
          };
          const router = createTagRouter({ hubTagsService });
          const app = setupBasicApp();

          app.use('/tags', router);

          return request(app)
            .get('/tags/1')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('#title').text()).toContain(
                data.name,
                'did not have correct header title',
              );

              expect($('#description').text()).toContain(
                data.description.sanitized,
              );

              expect($('[data-page-featured-image]').attr('style')).toContain(
                data.image.url,
                'did not render a featured image',
              );
            });
        });
      });

      describe('landing page related content', () => {
        it('correctly renders a tags page related content', () => {
          const hubTagsService = {
            termFor: jest.fn().mockReturnValue(data),
          };
          const router = createTagRouter({ hubTagsService });
          const app = setupBasicApp();

          app.use('/tags', router);

          return request(app)
            .get('/tags/1')
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('[data-featured-id]').length).toBe(
                1,
                'did not render the correct number of',
              );

              expect($('[data-featured-id="foo"]').text()).toContain(
                data.relatedContent.data[0].title,
                'did not render the correct related item title',
              );

              expect($('.tile-image').attr('src')).toContain(
                data.relatedContent.data[0].image.url,
                'did not render the correct related item image',
              );

              expect($('[data-featured-id="foo"]').attr('href')).toContain(
                `/content/${data.relatedContent.data[0].id}`,
                'did not render url',
              );
            });
        });
      });
    });
  });

  describe('/related-content/:id', () => {
    it('returns tags', () => {
      const data = [
        {
          id: 'foo',
          type: 'radio',
          title: 'foo related content',
          summary: 'Foo body',
          image: {
            url: 'foo.png',
          },
        },
      ];
      const hubTagsService = {
        relatedContentFor: jest.fn().mockReturnValue(data),
      };
      const router = createTagRouter({ hubTagsService });
      const app = setupBasicApp();

      app.use('/', router);

      return request(app)
        .get('/related-content/1')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then(res => {
          const result = JSON.parse(res.text);

          expect(result).toStrictEqual(data);
        });
    });
  });
});
