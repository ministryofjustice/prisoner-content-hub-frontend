const config = {
  newContentHub: { url: '/test-redirect'}
};

const inactiveEstablishment = {
  session: {
    establishmentId: 1603,
  },
};

const activeEstablishment = {
  session: {
    establishmentId: 792,
  },
};

jest.mock('../../config', () => config);

const redirectInactiveEstablishments = require('../redirectInactiveEstablishments');

describe('redirectInactiveEstablishments - config defined', () => {
  const res = {
    redirect: jest.fn()
  };

  beforeEach(() => {
    res.redirect.mockClear();
  });

  it('should redirect to the new content hub url for inactive establishments', () => {
    redirectInactiveEstablishments(inactiveEstablishment, res);

    expect(res.redirect).toHaveBeenCalledWith('/test-redirect')
  });

  it('should not redirect to the new content hub url for active establishments', () => {
    redirectInactiveEstablishments(activeEstablishment, res);

    expect(res.redirect).not.toHaveBeenCalled()
  });

  it('should not redirect if the new content hub url is empty', () => {
    config.newContentHub.url = ''
  
    redirectInactiveEstablishments(inactiveEstablishment, res);

    expect(res.redirect).not.toHaveBeenCalled()
  });
});
