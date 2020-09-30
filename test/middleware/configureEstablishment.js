const {
  configureEstablishment,
} = require('../../server/middleware/configureEstablishment');

describe('configureEstablishment', () => {
  const defaultPrison = 'wayland';
  const next = sinon.spy();

  beforeEach(() => {
    next.resetHistory();
  });

  it('should use the set the session from the config', () => {
    const configureEstablishmentMiddleware = configureEstablishment();
    const req = {
      session: {
        prison: '',
        establishmentName: defaultPrison,
        establishmentId: 793,
      },
    };

    const res = { locals: {} };

    configureEstablishmentMiddleware(req, res, next);

    expect(req.session).to.have.property(
      'prison',
      defaultPrison,
      'establishment should be persisted in the session',
    );
    expect(res.locals).to.have.property(
      'establishmentDisplayName',
      `HMP ${defaultPrison.slice(0, 1).toUpperCase() + defaultPrison.slice(1)}`,
    );
    expect(next.called).to.equal(true, 'next should have been called');
  });
});
