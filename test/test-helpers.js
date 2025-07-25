const express = require('express');
const i18next = require('i18next');
const filesystem = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');
const nunjucksSetup = require('../server/utils/nunjucksSetup');
const routes = require('../server/routes');
const setCurrentUser = require('../server/middleware/setCurrentUser');

const i18nextInitPromise = i18next
  .use(middleware.LanguageDetector)
  .use(filesystem)
  .init({
    debug: false,
    preload: ['en', 'cy'],
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, '../server/locales/{{lng}}.json'),
    },
    detection: {
      caches: ['cookie'],
    },
  });

function setupBasicApp(config = {}) {
  const app = express();
  app.use((req, res, next) => {
    res.locals = {
      currentLng: 'en',
    };
    next();
  });

  app.use(
    middleware.handle(i18next, {
      removeLngFromUrl: false,
    }),
  );

  app.set('view engine', 'html');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  nunjucksSetup(app);

  app.locals.config = config;

  return app;
}

const logger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  requestLogger: () => (req, res, next) => next(),
};

function consoleLogError(err, req, res) {
  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).send('Something broke!');
}

const createClient = () => ({
  get: jest.fn(),
  post: jest.fn(),
});

const lastCall = mockFn => mockFn.mock.calls[mockFn.mock.calls.length - 1];

const userSupplier = jest.fn();
const sessionSupplier = jest.fn();
const cookieSupplier = jest.fn();

const setupFullApp = (
  services = {},
  { config, establishmentData = {} } = {},
) => {
  sessionSupplier.mockReturnValue({
    isSignedIn: true,
    id: 1234,
    establishmentName: 'berwyn',
  });

  const app = express();
  app.use((req, res, next) => {
    res.locals = {
      currentLng: 'en',
    };
    next();
  });

  app.use(
    middleware.handle(i18next, {
      removeLngFromUrl: false,
    }),
  );
  app.set('view engine', 'html');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.locals.config = config;

  nunjucksSetup(app);

  app.use((req, res, next) => {
    req.user = userSupplier();
    req.session = sessionSupplier() || {};
    req.headers.cookie = cookieSupplier() || '';
    next();
  });
  app.use(setCurrentUser);
  app.use(routes(services, establishmentData));
  app.use(consoleLogError);

  return app;
};

module.exports = {
  setupBasicApp,
  testApp: {
    setupApp: setupFullApp,
    userSupplier,
    sessionSupplier,
    cookieSupplier,
  },
  logger,
  consoleLogError,
  createClient,
  lastCall,
  i18nextInitPromise,
};
