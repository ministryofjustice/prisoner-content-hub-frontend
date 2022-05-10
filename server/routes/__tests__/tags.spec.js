const request = require('supertest');
const cheerio = require('cheerio');

jest.mock('@sentry/node');

const { createTagRouter } = require('../tags');
const { setupBasicApp } = require('../../../test/test-helpers');

describe('GET /tags', () => {
  let app;

  const cmsService = {
    getTag: jest.fn(),
    getPage: jest.fn(),
  };

  const sessionMiddleware = (req, res, next) => {
    req.session = {
      establishmentId: 123,
      establishmentName: 'berwyn',
    };
    next();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    app = setupBasicApp();
    app.use(sessionMiddleware);
    app.use('/tags', createTagRouter({ cmsService }));
  });

  describe('/:id', () => {
    describe('on error', () => {
      it('passes caught exceptions to next', async () => {
        cmsService.getTag.mockRejectedValue('💥');
        await request(app).get('/tags/1').expect(500);
      });
    });

    describe('on success', () => {
      const data = {
        contentType: 'topic',
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

      describe('tags page header', () => {
        it('correctly renders a page header with an image', () => {
          cmsService.getTag.mockReturnValue(data);

          return request(app)
            .get('/tags/1')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('#title').text()).toContain(data.title);

              expect($('#description').text()).toContain(data.summary);

              expect($('[data-page-featured-image]').attr('style')).toContain(
                data.image.url,
                'did not render a featured image',
              );
            });
        });
      });
    });
  });

  describe('/:id.json', () => {
    describe('on error', () => {
      it('passes caught exceptions to next', async () => {
        cmsService.getPage.mockRejectedValue('💥');

        await request(app).get('/tags/1.json').expect(500);
      });
    });

    describe('on success', () => {
      const data = {
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
      };

      describe('tags page JSON endpoint', () => {
        it('correctly returns the JSON response', () => {
          cmsService.getPage.mockReturnValue(data);

          return request(app)
            .get('/tags/1.json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
              expect(response.body).toEqual(data);
              expect(cmsService.getPage).toHaveBeenCalledWith(
                'berwyn',
                1,
                1,
                '',
              );
            });
        });

        it('can specify page by query parameter', () => {
          cmsService.getPage.mockReturnValue(data);

          return request(app)
            .get('/tags/1.json?page=2')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
              expect(response.body).toEqual(data);
              expect(cmsService.getPage).toHaveBeenCalledWith(
                'berwyn',
                1,
                2,
                '',
              );
            });
        });
        it('can specify data type by query parameter', () => {
          cmsService.getPage.mockReturnValue(data);

          return request(app)
            .get('/tags/1.json?page=2&pageType=other')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
              expect(response.body).toEqual(data);
              expect(cmsService.getPage).toHaveBeenCalledWith(
                'berwyn',
                1,
                2,
                'other',
              );
            });
        });
      });
    });
  });
});
