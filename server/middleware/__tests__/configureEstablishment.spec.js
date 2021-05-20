const { configureEstablishment } = require('../configureEstablishment');

describe('configureEstablishment', () => {
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });

  it('should use the set the session from the config', () => {
    const req = {
      session: {
        establishmentName: 'wayland',
        establishmentId: 793,
      },
    };

    const res = { locals: {} };

    configureEstablishment()(req, res, next);

    expect(res.locals.establishmentDisplayName).toBe('HMP Wayland');
    expect(next).toHaveBeenCalled();
  });

  it('should retrieve establishment from the header name', () => {
    const req = {
      headers: {
        host:
          'cookhamwood-prisoner-content-hub-development.apps.live-1.cloud-platform.service.justice.gov.uk/',
      },
      session: {},
    };

    const res = { locals: {} };

    configureEstablishment()(req, res, next);

    expect(res.locals.establishmentDisplayName).toBe(`HMYOI Cookham Wood`);
  });
});
