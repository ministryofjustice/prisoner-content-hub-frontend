const request = require('supertest');

jest.mock('@sentry/node');

const { createHelpRouter } = require('../help');
const { setupBasicApp } = require('../../../test/test-helpers');

describe('GET /help', () => {
  let app;

  const ADULT = 'ADULT';
  const knownPages = {
    helpLink: ADULT,
  };

  const sessionMiddleware = id => (req, res, next) => {
    req.session = {
      establishmentId: id,
    };
    next();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    app = setupBasicApp();
  });

  describe('/', () => {
    it('should redirect to the help URL', done => {
      app.use(sessionMiddleware(123));
      app.use('/help', createHelpRouter(knownPages));
      request(app).get('/help').expect('location', ADULT).expect(302, done);
    });
  });
});
