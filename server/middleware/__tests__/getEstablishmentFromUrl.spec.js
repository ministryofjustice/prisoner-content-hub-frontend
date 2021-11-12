const getEstablishmentFromUrl = require('../getEstablishmentFromUrl');

describe('getEstablishmentFromUrl', () => {
  const urlStub = 'content-hub.prisoner.service.justice.gov.uk/';
  const next = jest.fn();
  const res = {};
  let req;
  beforeEach(() => {
    req = {
      headers: {
        host: `cookhamwood.${urlStub}`,
      },
      session: {},
    };
    next.mockClear();
  });

  it('should retrieve establishment from the header and set in the session', () => {
    getEstablishmentFromUrl(req, res, next);
    expect(req.session.establishmentName).toBe('cookhamwood');
  });
  it('should not retrieve establishment from the header and set in the session if not provided', () => {
    req.headers.host = urlStub;
    getEstablishmentFromUrl(req, res, next);
    expect(req.session.establishmentName).not.toBeDefined();
  });
});
