const request = require('supertest');
const cheerio = require('cheerio');
const { User } = require('../../auth/user');

const { createHomepageRouter } = require('../homepage');
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
    };
  });

  describe('Homepage', () => {
    const establishmentPersonalisationToggle = jest.fn();

    const testUser = new User({
      prisonerId: 'A1234BC',
      firstName: 'Test',
      surname: 'User',
      bookingId: 1234567,
    });

    const userSupplier = jest.fn();

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
      app.use(
        ['^/$', '/content', '/npr', '/tags'],
        retrieveTopicList(cmsService),
      );
      app.use(router);
      app.use(consoleLogError);
      userSupplier.mockReturnValue(testUser);
      establishmentPersonalisationToggle.mockReturnValue(true);
    });

    it('prompts the user to sign in when they are signed out', () => {
      userSupplier.mockReturnValue(undefined);
      return request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="signin-prompt"]').length).toBe(1);
          expect($('[data-test="user-name"]').length).toBe(0);
        });
    });

    it('does not prompt the user to sign in when they are signed in', () =>
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="signin-prompt"]').length).toBe(0);
          expect($('[data-test="user-name"]').length).toBe(1);
        }));

    it('renders homepage content', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-featured-tile-id="small"]').length).toBe(
            4,
            '4 small featured items should be rendered',
          );
          expect($('[data-featured-tile-id="large"]').length).toBe(
            2,
            '2 large featured items should be rendered',
          );
          expect(
            $('[data-featured-tile-id="small"]').first().find('h3').text(),
          ).toContain('foo title', 'Correct title rendered (Small Tile)');
          expect(
            $('[data-featured-tile-id="large"]').first().find('h3').text(),
          ).toContain('foo title', 'Correct title rendered (Large Tile)');
          expect(
            $('[data-featured-tile-id="large"]').first().find('p').text(),
          ).toContain(
            'foo summary',
            'Correct description rendered (Large Tile)',
          );
          expect(
            $('[data-featured-tile-id="small"]')
              .first()
              .find('img')
              .attr('src'),
          ).toContain('image.url.com', 'Correct image rendered (Small Tile)');
          expect(
            $('[data-featured-tile-id="large"]')
              .first()
              .find('img')
              .attr('src'),
          ).toContain('image.url.com', 'Correct image rendered (Large Tile)');
        }));

    it('has a search bar', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#search-wrapper').length).toBe(1);
        }));

    it('renders the home page events for today', () => {
      const currentEvents = {
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

      offenderService.getCurrentEvents.mockResolvedValue(currentEvents);

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

    it('renders the home page events for tomorrow', () => {
      const currentEvents = {
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
        isTomorrow: true,
      };

      offenderService.getCurrentEvents.mockResolvedValue(currentEvents);

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

    it('renders the home page with no events', () => {
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

    it('renders the home page with no events when user is logged out', () => {
      userSupplier.mockReturnValue(undefined);

      return request(app)
        .get('/')
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.todays-events__placeholder').length).toBe(1);
        });
    });

    it('renders an error when the home page cannot retrieve events', () => {
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

    it('returns topics footer', () =>
      request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.govuk-footer__list-item').length).toBe(2);
        }));
  });
});
