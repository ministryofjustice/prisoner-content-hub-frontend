const request = require('supertest');
const cheerio = require('cheerio');
const { User } = require('../../auth/user');

const { createHomepageRouter, removeDuplicateUpdates } = require('../homepage');
const {
  setupBasicApp,
  consoleLogError,
} = require('../../../test/test-helpers');
const setCurrentUser = require('../../middleware/setCurrentUser');
const retrieveTopicList = require('../../middleware/retrieveTopicList');

describe('GET /', () => {
  let featuredItem;
  let cmsService;
  let offenderService;
  let router;
  let app;
  let hubContent;
  let featuredContent;
  let keyInfo;
  let largeUpdateTile;
  let hubUpdatesContent;
  let uniqueHubcontent;

  beforeEach(() => {
    featuredItem = {
      title: 'foo title',
      contentType: 'foo',
      summary: 'foo summary',
      contentUrl: `/content/foo`,
      image: {
        alt: 'Foo image alt text',
        url: 'image.url.com',
      },
    };

    const setIdWith = item => id => ({ ...item, id });

    const featuredItemWithId = setIdWith(featuredItem);

    offenderService = {
      getCurrentEvents: jest.fn().mockResolvedValue({}),
    };
    hubContent = [
      {
        id: 15826,
        contentType: 'video',
        externalContent: false,
        title: 'BBC. The Story of Maths. The Language of the Universe',
        summary: 'BBC. The Story of Maths. The Language of the Universe',
        contentUrl: '/content/15826',
        displayUrl: undefined,
        image: { url: 'image url', alt: 'Alt text' },
        publishedAt: 'Monday 1st November',
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
        publishedAt: 'Wednesday 27th March',
      },
      {
        id: 333333,
        contentType: 'video',
        externalContent: false,
        title:
          'A title that is long enough to be cropped with an ellipse added to the end',
        summary: 'A summary',
        contentUrl: '/content/333333',
        displayUrl: undefined,
        image: { url: 'image url', alt: 'Alt text' },
        publishedAt: 'Tuesday 23rd August',
      },
      {
        id: 444444,
        contentType: 'video',
        externalContent: false,
        title:
          'A title that is long enough to be cropped with an ellipse added to the end',
        summary: 'A summary',
        contentUrl: '/content/444444',
        displayUrl: undefined,
        image: { url: 'image url', alt: 'Alt text' },
        publishedAt: 'Monday 30th October',
      },
    ];
    uniqueHubcontent = {
      id: 666666,
      contentType: 'video',
      externalContent: false,
      title: 'BBC. The Story of Maths. The Language of the Universe',
      summary: 'BBC. The Story of Maths. The Language of the Universe',
      contentUrl: '/content/666666',
      displayUrl: undefined,
      image: { url: 'image url', alt: 'Alt text' },
      publishedAt: 'Monday 1st November',
    };

    hubUpdatesContent = [
      ...hubContent,
      {
        id: 555555,
        contentType: 'video',
        externalContent: false,
        title:
          'A title that is long enough to be cropped with an ellipse added to the end',
        summary: 'A summary',
        contentUrl: '/content/555555',
        displayUrl: undefined,
        image: { url: 'image url', alt: 'Alt text' },
        publishedAt: 'Monday 17th October',
      },
    ];
    featuredContent = {
      data: hubContent,
    };
    keyInfo = {
      data: hubContent,
    };
    largeUpdateTile = uniqueHubcontent;

    cmsService = {
      getHomepage: jest.fn().mockReturnValue({
        upperFeatured: featuredItemWithId('large'),
        lowerFeatured: featuredItemWithId('large'),
        smallTiles: new Array(4).fill(featuredItemWithId('small')),
      }),
      getTopics: jest.fn().mockResolvedValue([
        { linkText: 'foo', href: '/content/foo' },
        { linkText: 'bar', href: '/content/bar' },
      ]),
      getRecentlyAddedHomepageContent: jest.fn().mockResolvedValue({
        data: [...hubContent],
      }),
      getHomepageContent: jest.fn().mockResolvedValue({
        featuredContent,
        keyInfo,
        largeUpdateTile,
      }),
      getExploreContent: jest.fn().mockResolvedValue({
        data: [...hubContent],
        isLastPage: true,
      }),
      getUpdatesContent: jest.fn().mockResolvedValue({
        largeUpdateTileDefault: hubContent[0],
        updatesContent: [...hubUpdatesContent],
      }),
    };
  });

  /* new homepage */
  describe('New homepage', () => {
    let testEvents;
    const establishmentPersonalisationToggle = jest.fn();
    const userSupplier = jest.fn();

    const testUser = new User({
      prisonerId: 'A1234BC',
      firstName: 'Test',
      surname: 'User',
      bookingId: 1234567,
    });

    beforeEach(() => {
      const establishmentData = {
        1: {
          name: 'berwyn',
        },
      };
      router = createHomepageRouter({
        cmsService,
        offenderService,
        establishmentData,
      });

      app = setupBasicApp();
      app.use((req, res, next) => {
        req.session = {
          establishmentName: 'berwyn',
          isSignedIn: true,
          establishmentPersonalisationEnabled:
            establishmentPersonalisationToggle(),
        };
        req.user = userSupplier();
        next();
      });
      app.use(setCurrentUser);
      app.use(['^/*'], retrieveTopicList(cmsService));
      app.use(router);
      app.use(consoleLogError);
      userSupplier.mockReturnValue(testUser);
      establishmentPersonalisationToggle.mockReturnValue(true);

      testEvents = {
        events: [
          {
            description: 'SUSPENDED ACTIVITY',
            startTime: '8:10AM',
            endTime: '11:25AM',
            location: 'Main exercise yard',
            timeString: '8:10AM to 11:25AM',
            eventType: 'PRISON_ACT',
            finished: false,
            status: 'SCH',
            paid: false,
          },
          {
            description: 'EDU IT AM',
            startTime: '8:10AM',
            endTime: '11:25AM',
            location: 'New education',
            timeString: '8:10AM to 11:25AM',
            eventType: 'PRISON_ACT',
            finished: false,
            status: 'SCH',
            paid: false,
          },
        ],
        isTomorrow: false,
      };
    });

    it('renders the homepage with a search bar', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#search-wrapper').length).toBe(1);
        }));

    describe('timetable events', () => {
      it('renders the homepage events for today', () => {
        offenderService.getCurrentEvents.mockResolvedValue(testEvents);

        return request(app)
          .get('/')
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('div.todays-events').first().find('h3').text()).toBe(
              "Today's events",
            );
            expect($('[data-test="event"]').length).toBe(
              2,
              'Correct number of events',
            );
          });
      });

      it('renders the homepage events for tomorrow', () => {
        testEvents = { ...testEvents, isTomorrow: true };

        offenderService.getCurrentEvents.mockResolvedValue(testEvents);

        return request(app)
          .get('/')
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('div.todays-events').first().find('h3').text()).toBe(
              "Tomorrow's events",
            );
            expect($('[data-test="event"]').length).toBe(
              2,
              'Correct number of events',
            );
          });
      });

      it('renders the homepage with no events', () => {
        const currentEvents = {
          events: [],
          isTomorrow: false,
        };

        offenderService.getCurrentEvents.mockResolvedValue(currentEvents);

        return request(app)
          .get('/')
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('[data-test="event"]').length).toBe(0);
            expect($('[data-test="no-events"]').length).toBe(1);
          });
      });
    });

    describe('featured update tile', () => {
      it('renders the homepage with the featured update tile', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('.govuk-hub-content-tile-featured').length).toBe(1);
          }));

      it('renders the homepage with the featured update tile containing an image', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect(
              $('.govuk-hub-content-tile-featured div').children()[0].type,
            ).toBe('tag');
            expect(
              $('.govuk-hub-content-tile-featured div').children()[0].name,
            ).toBe('img');
          }));

      it('renders the homepage with the featured update tile containing a h3 title', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect(
              $('.govuk-hub-content-tile-featured div div').children()[0].type,
            ).toBe('tag');
            expect(
              $('.govuk-hub-content-tile-featured div div').children()[0].name,
            ).toBe('h3');
          }));

      it('renders the homepage with the featured update tile containing a h3 title', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('.govuk-hub-content-tile-featured h3:last').text()).toBe(
              'BBC. The Story of Maths. The Language of the Universe',
            );
          }));
    });

    describe('updates tiles', () => {
      it('renders the homepage with the correct number of update tiles', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('.govuk-hub-update-items-link').length).toBe(4);
          }));

      it('Should render a html img tag in an update tile', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect(
              $('.govuk-hub-update-items-link div').children()[0].type,
            ).toBe('tag');
            expect(
              $('.govuk-hub-update-items-link div').children()[0].name,
            ).toBe('img');
          }));

      it('Should render a html h3 tag in an update tile', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect(
              $('.govuk-hub-update-items-link_text').children()[0].type,
            ).toBe('tag');
            expect(
              $('.govuk-hub-update-items-link_text').children()[0].name,
            ).toBe('h3');
          }));

      it('Should render a html h3 tag with the published date in an update tile', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('.govuk-hub-update-items-link_text h3:last').text()).toBe(
              'Monday 30th October',
            );
          }));

      it('Should render a "View all" link in the updates section', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('.govuk-hub-update-items a:last').text()).toContain(
              'View all',
            );
          }));

      describe('when there are no more updates section links', () => {
        describe('returning less than 5 links and the default large update is not required', () => {
          it('Should hide the "View all" link', () => {
            cmsService.getUpdatesContent = jest.fn().mockResolvedValue({
              largeUpdateTileDefault: uniqueHubcontent,
              updatesContent: [...hubContent],
              isLastPage: true,
            });
            return request(app)
              .get('/')
              .expect(200)
              .then(response => {
                const $ = cheerio.load(response.text);
                expect(
                  $('.govuk-hub-update-items a:last').text(),
                ).not.toContain('View all');
              });
          });
        });
        describe('returning 5 unique links and the default large update is not required', () => {
          it('Should render a "View all" link in the updates section', () => {
            cmsService.getUpdatesContent = jest.fn().mockResolvedValue({
              largeUpdateTileDefault: hubContent[0],
              updatesContent: [...hubContent, hubContent[0]],
              isLastPage: true,
            });
            return request(app)
              .get('/')
              .expect(200)
              .then(response => {
                const $ = cheerio.load(response.text);
                expect($('.govuk-hub-update-items a:last').text()).toContain(
                  'View all',
                );
              });
          });
        });
        describe('returning 5 links and the default large update is required', () => {
          it('Should hide the "View all" link', () => {
            cmsService.getUpdatesContent = jest.fn().mockResolvedValue({
              largeUpdateTileDefault: hubContent[0],
              updatesContent: [...hubContent, hubContent[0]],
              isLastPage: true,
            });
            cmsService.getHomepageContent = jest.fn().mockResolvedValue({
              featuredContent,
              keyInfo,
              largeUpdateTile: null,
            });
            return request(app)
              .get('/')
              .expect(200)
              .then(response => {
                const $ = cheerio.load(response.text);
                expect(
                  $('.govuk-hub-update-items a:last').text(),
                ).not.toContain('View all');
              });
          });
        });
      });
    });

    describe('removeDuplicateUpdates', () => {
      let updatesContentWithDuplicateRemoved;

      beforeEach(() => {
        updatesContentWithDuplicateRemoved = removeDuplicateUpdates(
          hubUpdatesContent,
          hubUpdatesContent[0],
        );
      });

      it('should remove the update object with an id that matches the largeUpdateTileContent id', () =>
        expect(updatesContentWithDuplicateRemoved).toEqual(
          expect.not.objectContaining(hubUpdatesContent[0]),
        ));

      it('should return the remaining 4 items in the updatesContent array when a duplicate item has been removed', () =>
        expect(updatesContentWithDuplicateRemoved.length).toBe(4));
    });

    describe('key info tiles', () => {
      it('renders the homepage with the correct number of update key info content tiles', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('#keyInfo a').length).toBe(4);
          }));

      it('Should render a html img tag in the homepage key info content tile', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('#keyInfo a').children()[0].type).toBe('tag');
            expect($('#keyInfo a').children()[0].name).toBe('img');
          }));

      it('Should render a html h3 tag in the homepage key info content tile', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('#keyInfo a').children()[1].type).toBe('tag');
            expect($('#keyInfo a').children()[1].name).toBe('h3');
          }));

      it('Should render a html h3 tag with the expected text in the homepage key info content tile', () =>
        request(app)
          .get('/')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('#keyInfo a h3:last').text()).toBe(
              'A title that is long enough to be cropped with an ellipse added to the end',
            );
          }));
    });

    it('renders the homepage with the correct number of recently added content tiles', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#recentlyAdded .small-tiles a').length).toBe(4);
        }));

    it('renders the homepage with the correct number of explore content tiles', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#exploreContent .small-tiles a').length).toBe(4);
        }));

    it('renders the homepage with the correct number of featured content tiles', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#featuredContent .small-tiles a').length).toBe(4);
        }));

    it('renders an error when the homepage cannot retrieve events', () => {
      offenderService.getCurrentEvents.mockResolvedValue({
        error: 'We are not able to show your schedule for today at this time',
      });

      return request(app)
        .get('/')
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="event-error"]').length).toBe(1);
        });
    });

    it('renders the homepage with topics footer', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.govuk-footer__list-item').length).toBe(2);
        }));
  });
});
