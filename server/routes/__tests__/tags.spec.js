const request = require('supertest');
const cheerio = require('cheerio');

jest.mock('@sentry/node');

const { createTagRouter } = require('../tags');
const { setupBasicApp } = require('../../../test/test-helpers');

describe('GET /tags', () => {
  describe('/:id', () => {
    describe('on error', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('passes caught exceptions to next', async () => {
        const cmsService = {
          getTag: jest.fn().mockRejectedValue('💥'),
        };
        const router = createTagRouter({ cmsService });
        const app = setupBasicApp();

        app.use('/tags', router);

        await request(app).get('/tags/1').expect(500);
      });
      it('returns a 500 when incorrect data is returned', async () => {
        const cmsService = {
          getTag: jest.fn().mockRejectedValue('error'),
        };
        const router = createTagRouter({ cmsService });
        const app = setupBasicApp();

        app.use('/tags', router);

        await request(app).get('/tags/1').expect(500);
      });
    });

    describe('on success', () => {
      const data = {
        contentType: 'tags',
        title: 'foo bar',
        summary: 'foo description',
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

      const sessionMiddleware = (req, res, next) => {
        req.session = {
          establishmentId: 123,
          establishmentName: 'berwyn',
        };
        next();
      };

      describe('tags page header', () => {
        it('correctly renders a page header with an image', () => {
          const cmsService = {
            getTag: jest.fn().mockReturnValue(data),
          };
          const router = createTagRouter({ cmsService });
          const app = setupBasicApp();

          app.use(sessionMiddleware);
          app.use('/tags', router);

          return request(app)
            .get('/tags/1')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('#title').text()).toContain(
                data.title,
                'did not have correct header title',
              );

              expect($('#description').text()).toContain(data.summary);

              expect($('[data-page-featured-image]').attr('style')).toContain(
                data.image.url,
                'did not render a featured image',
              );
            });
        });
      });

      describe('landing page related content', () => {
        it('correctly renders a tags page related content', () => {
          const cmsService = {
            getTag: jest.fn().mockReturnValue(data),
          };
          const router = createTagRouter({ cmsService });
          const app = setupBasicApp();

          app.use(sessionMiddleware);
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
});
