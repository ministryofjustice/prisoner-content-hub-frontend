const request = require('supertest');

const { createApp } = require('../app');
const config = require('../config');
const { logger } = require('../../test/test-helpers');

describe('App', () => {
  it('renders a 404 page correctly on invalid url', async () => {
    config.auth.callbackPath = '/testPath';
    await request(app())
      .get('/unknown-url')
      .expect(404)
      .then(res => {
        expect(res.text).toContain(
          'The page you are looking for could not be found',
        );
      });
  });

  it('hides the stack trace on error pages', async () => {
    config.auth.callbackPath = '/testPath';
    const error = {
      message: 'Something has gone horribly wrong',
      stack: 'beep-boop',
    };

    await request(
      app({
        hubFeaturedContentService: {
          hubFeaturedContent: jest.fn().mockRejectedValue(error),
        },
        hubMenuService: {
          tagsMenu: jest.fn().mockResolvedValue({}),
        },
        offenderService: {
          getOffenderDetailsFor: jest.fn().mockResolvedValue({}),
        },
      }),
    )
      .get('/')
      .expect(500)
      .then(response => {
        expect(response.text).not.toContain(
          error.stack,
          'it should not show the error message',
        );
        expect(response.text).not.toContain(
          error.stack,
          'it should not show the stack',
        );
      });
  });

  it('shows the stack trace on error pages', async () => {
    const error = {
      message: 'Something has gone horribly wrong',
      stack: 'beep-boop',
    };
    const previousConfiguration = JSON.stringify(config.features);

    config.auth.callbackPath = '/testPath';
    config.features.showStackTraces = true;

    await request(
      app({
        hubFeaturedContentService: {
          hubFeaturedContent: jest.fn().mockRejectedValue(error),
        },
        offenderService: {
          getEventsForToday: jest.fn().mockResolvedValue([]),
          getEventsFor: jest.fn().mockResolvedValue([]),
          getOffenderDetailsFor: jest.fn().mockResolvedValue({}),
        },
      }),
    )
      .get('/')
      .expect(500)
      .then(res => {
        expect(res.text).toContain(
          error.message,
          'it should show the error message',
        );
        expect(res.text).toContain(error.stack, 'it should show the stack');

        // restore config
        config.features = JSON.parse(previousConfiguration);
      });
  });

  it('contains the correct security headers per request', async () => {
    config.auth.callbackPath = '/testPath';
    await request(app())
      .get('/')
      .then(res => {
        expect(res.headers).toHaveProperty('x-dns-prefetch-control');
        expect(res.headers).toHaveProperty('x-frame-options');
        expect(res.headers).toHaveProperty('x-download-options');
        expect(res.headers).toHaveProperty('x-content-type-options');
        expect(res.headers).toHaveProperty('x-xss-protection');
      });
  });
});

function app(opts) {
  const services = {
    hubFeaturedContentService: {
      hubFeaturedContent: jest.fn().mockResolvedValue([]),
    },
    hubMenuService: {
      navigationMenu: jest.fn().mockReturnValue({ topicsMenu: [] }),
    },
    offenderService: {
      getOffenderDetailsFor: jest.fn().mockResolvedValue({}),
    },
    hubContentService: { contentFor: jest.fn().mockResolvedValue({}) },
    searchService: { find: jest.fn() },
    logger,
    requestLogger: () => (req, res, next) => next(),
    ...opts,
  };
  return createApp(services);
}
