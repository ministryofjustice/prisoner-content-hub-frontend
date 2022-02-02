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

  const getTests = (env, urlStubWith, urlStubWithout) => {
    it(`should retrieve establishment from the header in ${env} and set in the session`, () => {
      req.headers.host = urlStubWith;
      getEstablishmentFromUrl(req, res, next);
      expect(req.session.establishmentName).toBe('cookhamwood');
    });
    it(`should not retrieve establishment from the header and set in the session in ${env} if not provided`, () => {
      req.headers.host = urlStubWithout;
      getEstablishmentFromUrl(req, res, next);
      expect(req.session.establishmentName).not.toBeDefined();
    });
  };

  describe('for localhost urls', () => {
    getTests('development', 'cookhamwood.localhost:3000', 'localhost:3000');
  });

  describe('for local urls', () => {
    getTests(
      'local',
      'cookhamwood.prisoner-content-hub.local:3000',
      'localhost:3000',
    );
  });

  describe('for development urls', () => {
    getTests(
      'development',
      'cookhamwood-prisoner-content-hub-development-395.apps.live.cloud-platform.service.justice.gov.uk/',
      'prisoner-content-hub-development-395.apps.live.cloud-platform.service.justice.gov.uk/',
    );
  });
  describe('for staging urls', () => {
    getTests(
      'staging',
      'cookhamwood-prisoner-content-hub-staging.apps.live.cloud-platform.service.justice.gov.uk',
      'prisoner-content-hub-staging.apps.live.cloud-platform.service.justice.gov.uk',
    );
  });
  describe('for production urls', () => {
    getTests(
      'production',
      'cookhamwood.content-hub.prisoner.service.justice.gov.uk',
      'content-hub.prisoner.service.justice.gov.uk/',
    );
  });
});
