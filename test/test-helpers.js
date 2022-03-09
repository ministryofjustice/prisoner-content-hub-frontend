const express = require('express');
const nunjucksSetup = require('../server/utils/nunjucksSetup');
const routes = require('../server/routes');
const setCurrentUser = require('../server/middleware/setCurrentUser');
const { User } = require('../server/auth/user');

const testData = {
  user: new User({
    prisonerId: 'A1234BC',
    firstName: 'Test',
    surname: 'User',
    bookingId: 1234567,
  }),
};

function setupBasicApp(config = {}) {
  const app = express();
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

const setupFullApp = (services = {}, { config } = {}) => {
  sessionSupplier.mockReturnValue({
    isSignedIn: true,
    id: 1234,
    establishmentName: 'berwyn',
  });

  const app = express();
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
  app.use(routes(services));
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
  testData,
};
