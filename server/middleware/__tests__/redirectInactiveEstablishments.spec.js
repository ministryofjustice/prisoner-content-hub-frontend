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

  const next = jest.fn()

  beforeEach(() => {
    res.redirect.mockClear();
    next.mockClear();
  });

  it('should redirect to the new content hub url for inactive establishments', () => {
    redirectInactiveEstablishments(inactiveEstablishment, res, next);

    expect(res.redirect).toHaveBeenCalledWith('/test-redirect')
    expect(next).not.toHaveBeenCalled();
  });

  it('should redirect to the new content hub url for inactive establishments - including path', () => {
    const inactiveEstablishmentWithPath = {...inactiveEstablishment, path: '/content/1111'}
    
    redirectInactiveEstablishments(inactiveEstablishmentWithPath, res, next);

    expect(res.redirect).toHaveBeenCalledWith('/test-redirect/content/1111')
    expect(next).not.toHaveBeenCalled();
  });

  it('should not redirect to the new content hub url for active establishments', () => {
    redirectInactiveEstablishments(activeEstablishment, res, next);

    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled();
  });

  it('should not redirect if the new content hub url is empty', () => {
    config.newContentHub.url = ''
  
    redirectInactiveEstablishments(inactiveEstablishment, res, next);

    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled();
  });
});
