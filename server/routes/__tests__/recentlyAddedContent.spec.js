const request = require('supertest');
const cheerio = require('cheerio');

jest.mock('@sentry/node');

const { createRecentlyAddedContentRouter } = require('../recentlyAdded');
const { setupBasicApp } = require('../../../test/test-helpers');

describe('GET /recently-added', () => {
  let app;

  const cmsService = {
    getRecentlyAddedContent: jest.fn(),
  };

  const sessionMiddleware = (req, res, next) => {
    req.session = {
      establishmentId: 123,
      establishmentName: 'berwyn',
    };
    next();
  };

  let relatedContent;
  let data;

  beforeEach(() => {
    jest.clearAllMocks();
    app = setupBasicApp();
    app.use(sessionMiddleware);
    app.use('/', createRecentlyAddedContentRouter({ cmsService }));

    relatedContent = [
      {
        id: 15826,
        contentType: 'video',
        externalContent: false,
        title: 'BBC. The Story of Maths. The Language of the Universe',
        summary: 'BBC. The Story of Maths. The Language of the Universe',
        contentUrl: '/content/15826',
        displayUrl: undefined,
        image: { url: 'image url', alt: 'Alt text' },
      },
      {
        id: 15825,
        contentType: 'video',
        externalContent: false,
        title: 'The Queen: 70 Glorious Years - British Royal Documentary',
        summary: 'The Queen: 70 Glorious Years - British Royal Documentary',
        contentUrl: '/content/15825',
        displayUrl: undefined,
        image: { url: 'image url', alt: 'Alt text' },
      },
    ];

    data = {
      isLastPage: false,
      data: relatedContent,
    };
  });

  describe('/', () => {
    describe('on error', () => {
      it('passes caught exceptions to next', async () => {
        cmsService.getRecentlyAddedContent.mockRejectedValue('💥');
        await request(app).get('/').expect(500);
      });
    });

    describe('on success', () => {
      describe('recently-added page header', () => {
        it('correctly renders a page header', () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/')
            .expect(200)
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('#title').text()).toContain('Recently added');

              expect($('#description').text()).toContain(
                'The latest uploads on the Hub.',
              );
            });
        });
      });

      describe('recently-added related content', () => {
        it('correctly renders related content', () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/')
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('[data-featured-id]').length).toBe(2);

              expect($('[data-featured-id="15826"]').text()).toContain(
                relatedContent[0].title,
              );

              expect($('[data-featured-id="15825"]').text()).toContain(
                relatedContent[1].title,
              );

              expect($('.tile-image').attr('src')).toContain(
                relatedContent[0].image.url,
              );

              expect($('[data-featured-id="15826"]').attr('href')).toContain(
                `/content/${relatedContent[0].id}`,
              );

              expect($('[data-featured-id="15825"]').attr('href')).toContain(
                `/content/${relatedContent[1].id}`,
              );
            });
        });

        it('should display the Show more button when it is not the last page', () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/')
            .then(response => {
              const $ = cheerio.load(response.text);
              expect($('.show-more-tiles').length).toBe(1);
            });
        });

        it('should hide the Show more button when it is the last page', () => {
          data.isLastPage = true;
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/')
            .then(response => {
              const $ = cheerio.load(response.text);
              expect($('.show-more-tiles').length).toBe(0);
            });
        });
      });
    });
  });

  describe('/json', () => {
    describe('on error', () => {
      it('passes caught exceptions to next', async () => {
        cmsService.getRecentlyAddedContent.mockRejectedValue('💥');
        await request(app).get('/json').expect(500);
      });
    });

    describe('on success', () => {
      describe('json', () => {
        it('it should return JSON data', () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/json')
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
            });
        });

        it("it should return JSON data containing the expected 'isLastPage' key/value pair value", () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/json')
            .expect(200)
            .then(response => {
              const { isLastPage } = response.body;
              expect(isLastPage).toBeDefined();
              expect(isLastPage).toBe(false);
            });
        });

        it('it should return JSON data containing the expected data', () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/json')
            .expect(200)
            .then(response => {
              const { data: respData } = response.body;
              expect(respData).toBeDefined();
              expect(respData.length).toBe(2);
              expect(respData).toEqual(data.data);
            });
        });

        it('it should return JSON data containing the expected data types', () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/json')
            .expect(200)
            .then(response => {
              const { data: respData } = response.body;
              expect(respData).toBeDefined();
              expect(respData[0]).toEqual(
                expect.objectContaining({
                  id: expect.any(Number),
                  contentType: expect.any(String),
                  externalContent: expect.any(Boolean),
                  title: expect.any(String),
                  contentUrl: expect.any(String),
                  image: expect.any(Object),
                }),
              );
            });
        });

        it("it should return JSON data containing an 'image' object with the expected data", () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/json')
            .expect(200)
            .then(response => {
              const { image } = response.body.data[0];
              expect(image).toBeDefined();
              expect(image).toEqual(data.data[0].image);
            });
        });

        it("it should return JSON data containing an 'image' object with the expected data types", () => {
          cmsService.getRecentlyAddedContent.mockReturnValue(data);

          return request(app)
            .get('/json')
            .expect(200)
            .then(response => {
              const { image } = response.body.data[0];
              expect(image).toEqual(
                expect.objectContaining({
                  alt: expect.any(String),
                  url: expect.any(String),
                }),
              );
            });
        });
      });
    });
  });
});
