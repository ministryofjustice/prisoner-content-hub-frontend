const getEstablishmentFromUrl = require('../getEstablishmentFromUrl');

describe('getEstablishmentFromUrl', () => {
  const next = jest.fn();
  const res = {};
  let req;
  beforeEach(() => {
    req = {
      headers: {
        host: ``,
      },
      session: {},
    };
    next.mockClear();
  });

  const getTests = (env, urlStubWith) => {
    it(`should retrieve establishment from the header in ${env} and set in the session`, () => {
      req.headers.host = urlStubWith;
      getEstablishmentFromUrl(req, res, next);
      expect(req.session.establishmentName).toBe('etwoe');
    });
  };

  describe('for localhost urls', () => {
    getTests('development', 'etwoe.localhost:3000');
  });

  describe('for local urls', () => {
    getTests('local', 'etwoe.prisoner-content-hub.local:3000');
  });

  describe('for development urls', () => {
    getTests(
      'development',
      'etwoe-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk/',
    );
  });
  describe('for staging urls', () => {
    getTests(
      'staging',
      'etwoe-staging.content-hub.prisoner.service.justice.gov.uk',
    );
  });
  describe('for production urls', () => {
    getTests('production', 'etwoe.content-hub.prisoner.service.justice.gov.uk');
  });
});
