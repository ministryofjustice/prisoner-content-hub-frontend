const setReturnUrl = require('../setReturnUrl');

describe('setReturnUrl', () => {
  const next = jest.fn();
  const ORIGINAL_URL = 'originalUrl';
  let res;
  const req = { originalUrl: ORIGINAL_URL };

  beforeEach(() => {
    res = { locals: {} };
    next.mockClear();
    setReturnUrl(req, res, next);
  });

  it('should use req object to set the returnUrl', () => {
    expect(res.locals.returnUrl).toBe(ORIGINAL_URL);
    expect(next).toHaveBeenCalled();
  });
});
