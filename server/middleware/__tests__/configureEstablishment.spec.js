const { configureEstablishment } = require('../configureEstablishment');

describe('configureEstablishment', () => {
  const next = jest.fn();
  let res;

  beforeEach(() => {
    res = { locals: {} };
    next.mockClear();
  });

  it('should use session data if already set', () => {
    const req = {
      session: {
        id: 1,
        establishmentName: 'berwyn',
        establishmentId: 792,
        establishmentPersonalisationEnabled: true,
      },
    };

    configureEstablishment()(req, res, next);

    expect(res.locals.establishmentDisplayName).toBe('HMP Berwyn');
    expect(next).toHaveBeenCalled();
  });

  it('should retrieve establishment from the header name', () => {
    const req = {
      headers: {
        host: 'cookhamwood-prisoner-content-hub-development.apps.live-1.cloud-platform.service.justice.gov.uk/',
      },
      session: {},
    };

    configureEstablishment()(req, res, next);

    expect(res.locals.establishmentDisplayName).toBe('HMYOI Cookham Wood');
  });
});
