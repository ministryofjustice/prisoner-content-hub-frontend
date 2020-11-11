const { configureEstablishment } = require('../configureEstablishment');

describe('configureEstablishment', () => {
  const defaultPrison = 'wayland';
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });

  it('should use the set the session from the config', () => {
    const configureEstablishmentMiddleware = configureEstablishment();
    const req = {
      session: {
        establishmentName: defaultPrison,
        establishmentId: 793,
      },
    };

    const res = { locals: {} };

    configureEstablishmentMiddleware(req, res, next);

    expect(res.locals).toHaveProperty(
      'establishmentDisplayName',
      `HMP ${defaultPrison.slice(0, 1).toUpperCase() + defaultPrison.slice(1)}`,
    );
    expect(next.mock.calls.length).toBeGreaterThan(
      0,
      'next should have been called',
    );
  });
});
