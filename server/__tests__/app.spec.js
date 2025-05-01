const Sentry = require('@sentry/node');
const request = require('supertest');

const { createApp } = require('../app');
const config = require('../config');
const { logger } = require('../../test/test-helpers');

jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  httpIntegration: jest.fn(),
  expressIntegration: jest.fn(),
  setupExpressErrorHandler: jest.fn(),
}));
jest.mock('passport', () => ({
  use: jest.fn(() => true),
  serializeUser: jest.fn(() => true),
  deserializeUser: jest.fn(() => true),
  initialize: jest.fn(() => (req, res, next) => {
    next();
  }),
  session: jest.fn(() => (req, res, next) => {
    next();
  }),
}));
jest.mock('passport-azure-ad-oauth2', () =>
  jest.fn().mockImplementation(() => ({})),
);

describe('Sentry', () => {
  it('initializes Sentry', () => {
    app();
    expect(Sentry.init).toHaveBeenCalled();
  });

  it('creates the Sentry error handling middleware', () => {
    app();
    expect(Sentry.setupExpressErrorHandler).toHaveBeenCalled();
  });

  it('does not call the Sentry capture exception when a request succeeds', async () => {
    await request(app())
      .get('/games/chess')
      .set('host', 'wayland.content-hub')
      .expect(200);
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('calls the Sentry request handling middleware when an request is made', async () => {
    await request(app())
      .get('/games/chess')
      .set('host', 'wayland.content-hub')
      .expect(200);
    expect(Sentry.setupExpressErrorHandler).toHaveBeenCalled();
  });
});

describe('App', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders a 404 page correctly on invalid url', async () => {
    await request(app())
      .get('/unknown-url')
      .set('host', 'wayland.content-hub')
      .then(res => {
        expect(res.text).toContain(
          'The page you are looking for could not be found',
        );
      });
  });

  it('hides the error on error pages', async () => {
    await request(app())
      .get('/')
      .expect(500)
      .then(res => {
        expect(res.text).toContain('Something went wrong');
        expect(res.text).not.toContain('Could not determine establishment');
      });
  });

  it('shows the error on error pages', async () => {
    const previousConfiguration = JSON.stringify(config.features);

    config.features.showStackTraces = true;
    await request(app())
      .get('/')
      .expect(500)
      .then(res => {
        expect(res.text).toContain('Could not determine establishment');
        // restore config
        config.features = JSON.parse(previousConfiguration);
      });
  });

  it('contains the correct security headers per request', async () => {
    await request(app())
      .get('/')
      .set('host', 'wayland.prisoner-content-hub')
      .then(res => {
        expect(res.headers).toHaveProperty('x-dns-prefetch-control');
        expect(res.headers).toHaveProperty('x-frame-options');
        expect(res.headers).toHaveProperty('x-download-options');
        expect(res.headers).toHaveProperty('x-content-type-options');
        expect(res.headers).toHaveProperty('x-xss-protection');
      });
  });
});

function app(opts = {}) {
  const services = {
    cmsService: {
      getPrimaryNavigation: jest.fn().mockResolvedValue([]),
      getUrgentBanners: jest.fn().mockResolvedValue([]),
      getTopics: jest.fn().mockResolvedValue([]),
    },
    offenderService: {
      getOffenderDetailsFor: jest.fn().mockResolvedValue({}),
    },
    hubContentService: { contentFor: jest.fn().mockResolvedValue({}) },
    searchService: { find: jest.fn() },
    logger,
    requestLogger: () => (_req, _res, next) => next(),
    ...opts,
  };
  return createApp(services);
}
