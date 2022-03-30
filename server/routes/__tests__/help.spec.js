const request = require('supertest');

jest.mock('@sentry/node');

const { createHelpRouter } = require('../help');
const { setupBasicApp } = require('../../../test/test-helpers');

describe('GET /help', () => {
  let app;

  const establishmentData = {
    123: {
      youth: false,
    },
    456: {
      youth: true,
    },
  };
  const YOI = 'YOI';
  const ADULT = 'ADULT';
  const knownPages = {
    helpLinkYoi: YOI,
    helpLinkAdult: ADULT,
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
    it('should redirect to an Adult help URL', done => {
      app.use(sessionMiddleware(123));
      app.use('/help', createHelpRouter(establishmentData, knownPages));
      request(app).get('/help').expect('location', ADULT).expect(302, done);
    });

    it('should redirect to a YOI help URL', done => {
      app.use(sessionMiddleware(456));
      app.use('/help', createHelpRouter(establishmentData, knownPages));
      request(app).get('/help').expect('location', YOI).expect(302, done);
    });
  });
});
