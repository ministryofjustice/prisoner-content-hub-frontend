const express = require('express');
const nunjucksSetup = require('../server/utils/nunjucksSetup');

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

const lastCallLastArg = mockFn => {
  const lastCallResult = lastCall(mockFn);
  return lastCallResult[lastCallResult.length - 1];
};

module.exports = {
  setupBasicApp,
  logger,
  consoleLogError,
  createClient,
  lastCall,
  lastCallLastArg,
};
