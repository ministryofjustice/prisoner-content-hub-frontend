const Sentry = require('@sentry/node');
const passport = require('passport');
const request = require('supertest');

const { createApp } = require('../app');
const config = require('../config');
const { logger } = require('../../test/test-helpers');
const { User } = require('../auth/user');

jest.mock('@sentry/node', () => {
  const errorHandlingMiddleware = jest.fn();
  const requestHandlingMiddleware = jest.fn();
  const tracingHandlingMiddleware = jest.fn();
  const httpHandlingMiddleware = jest.fn();
  const expressHandlingMiddleware = jest.fn();
  return {
    init: jest.fn(),
    Integrations: {
      Http: jest.fn(() => (req, res, next) => {
        httpHandlingMiddleware();
        next();
      }),
      Express: jest.fn(() => (req, res, next) => {
        expressHandlingMiddleware();
        next();
      }),
    },
    Handlers: {
      errorHandler: jest.fn(() => (err, req, res, next) => {
        errorHandlingMiddleware();
        next(err);
      }),
      requestHandler: jest.fn(() => (req, res, next) => {
        requestHandlingMiddleware();
        next();
      }),
      tracingHandler: jest.fn(() => (req, res, next) => {
        tracingHandlingMiddleware();
        next();
      }),
    },

    captureMessage: jest.fn(),
    errorHandlingMiddleware,
    requestHandlingMiddleware,
    tracingHandlingMiddleware,
    httpHandlingMiddleware,
    expressHandlingMiddleware,
  };
});
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
    expect(Sentry.Handlers.errorHandler).toHaveBeenCalled();
  });

  it('creates the Sentry request handling middleware', () => {
    app();
    expect(Sentry.Handlers.requestHandler).toHaveBeenCalled();
  });

  it('creates the Sentry tracing handling middleware', () => {
    app();
    expect(Sentry.Handlers.tracingHandler).toHaveBeenCalled();
  });

  it('does not call the Sentry error handling middleware when a request succeeds', async () => {
    await request(app())
      .get('/games/chess')
      .set('host', 'wayland.content-hub')
      .expect(200);
    expect(Sentry.errorHandlingMiddleware).not.toHaveBeenCalled();
  });

  it('calls the Sentry request handling middleware when an request is made', async () => {
    await request(app())
      .get('/games/chess')
      .set('host', 'wayland.content-hub')
      .expect(200);
    expect(Sentry.requestHandlingMiddleware).toHaveBeenCalled();
  });
});

describe('App', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('when there is no establishment name, it attempts to log the user in', async () => {
    await request(app())
      .get('/unknown-url')
      .expect('Location', '/auth/sign-in?returnUrl=/unknown-url')
      .expect(302)
      .then(({ text }) => {
        expect(text).toContain('Found. Redirecting to ');
      });
  });
  it('renders a 404 page correctly on invalid url', async () => {
    config.auth.callbackPath = '/testPath';
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
    config.auth.callbackPath = '/testPath';
    passport.session.mockReturnValueOnce((req, res, next) => {
      req.user = new User({
        prisonerId: 'G2168GG',
        firstName: 'Test',
        lastName: 'User',
      });
      next();
    });

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

    config.auth.callbackPath = '/testPath';
    config.features.showStackTraces = true;
    passport.session.mockReturnValueOnce((req, res, next) => {
      req.user = new User({
        prisonerId: 'G2168GG',
        firstName: 'Test',
        lastName: 'User',
      });
      next();
    });

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
    config.auth.callbackPath = '/testPath';
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

  describe('Creating authentication routes', () => {
    const mockSignIn = jest.fn((req, res) => res.send());
    const mockSignOut = jest.fn((req, res) => res.send());
    const createMockSignIn = jest.fn(() => mockSignIn);
    const createMockSignOut = jest.fn(() => mockSignOut);
    const signIn = jest.fn((req, res) => res.send());
    const signInCallback = jest.fn((req, res) => res.send());
    const signOut = jest.fn((req, res) => res.send());
    const createSignInMiddleware = jest.fn(() => signIn);
    const createSignOutMiddleware = jest.fn(() => signOut);
    const createSignInCallbackMiddleware = jest.fn(() => signInCallback);
    const authMiddleware = {
      createMockSignIn,
      createMockSignOut,
      createSignInMiddleware,
      createSignOutMiddleware,
      createSignInCallbackMiddleware,
    };

    // We Stringify/Parse the config to deep-clone and restore before each test
    // This avoids polluting the configuration
    const originalConfig = JSON.stringify(config);
    let testConfig;

    beforeEach(() => {
      testConfig = JSON.parse(originalConfig);
      jest.clearAllMocks();
    });

    it('should use mock middleware when "useMockAuth" is set to true', async () => {
      testConfig.features.useMockAuth = true;

      const application = app({
        config: testConfig,
        authMiddleware,
      });

      expect(createMockSignIn).toHaveBeenCalled();
      expect(createMockSignOut).toHaveBeenCalled();

      await request(application)
        .get('/auth/sign-in')
        .then(() => {
          expect(mockSignIn).toHaveBeenCalled();
        });

      await request(application)
        .get('/auth/sign-out')
        .then(() => {
          expect(mockSignOut).toHaveBeenCalled();
        });
    });

    it('should not use mock middleware when "useMockAuth" is set to false', async () => {
      testConfig.features.useMockAuth = false;

      const application = app({
        config: testConfig,
        authMiddleware,
      });

      expect(createSignInMiddleware).toHaveBeenCalled();
      expect(createSignInCallbackMiddleware).toHaveBeenCalled();
      expect(createSignOutMiddleware).toHaveBeenCalled();
      expect(createMockSignIn).not.toHaveBeenCalled();
      expect(createMockSignOut).not.toHaveBeenCalled();

      await request(application)
        .get('/auth/sign-in')
        .then(() => {
          expect(signIn).toHaveBeenCalled();
          expect(mockSignIn).not.toHaveBeenCalled();
        });

      await request(application)
        .get('/auth/provider/callback')
        .then(() => {
          expect(signInCallback).toHaveBeenCalled();
        });

      await request(application)
        .get('/auth/sign-out')
        .then(() => {
          expect(signOut).toHaveBeenCalled();
          expect(mockSignOut).not.toHaveBeenCalled();
        });
    });

    it('should default "useMockAuth" to false', async () => {
      const application = app({
        config: testConfig,
        authMiddleware,
      });

      expect(createSignInMiddleware).toHaveBeenCalled();
      expect(createSignInCallbackMiddleware).toHaveBeenCalled();
      expect(createSignOutMiddleware).toHaveBeenCalled();
      expect(createMockSignIn).not.toHaveBeenCalled();
      expect(createMockSignOut).not.toHaveBeenCalled();

      await request(application)
        .get('/auth/sign-in')
        .then(() => {
          expect(signIn).toHaveBeenCalled();
          expect(mockSignIn).not.toHaveBeenCalled();
        });

      await request(application)
        .get('/auth/provider/callback')
        .then(() => {
          expect(signInCallback).toHaveBeenCalled();
        });

      await request(application)
        .get('/auth/sign-out')
        .then(() => {
          expect(signOut).toHaveBeenCalled();
          expect(mockSignOut).not.toHaveBeenCalled();
        });
    });
  });
});

function app(opts = {}) {
  const services = {
    cmsService: {
      getHomepage: jest.fn().mockResolvedValue([]),
      getPrimaryNavigation: jest.fn().mockResolvedValue([]),
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
