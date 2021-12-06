const configureEstablishment = require('../configureEstablishment');

describe('configureEstablishment', () => {
  const next = jest.fn();
  let res;

  beforeEach(() => {
    res = { locals: {} };
    next.mockClear();
  });

  it('should use session data to set the local data', () => {
    const req = {
      session: {
        id: 1,
        establishmentName: 'berwyn',
        establishmentId: 792,
        establishmentPersonalisationEnabled: true,
      },
    };

    configureEstablishment(req, res, next);

    expect(res.locals.establishmentName).toBe('berwyn');
    expect(res.locals.establishmentDisplayName).toBe('HMP Berwyn');
    expect(next).toHaveBeenCalled();
  });
});
