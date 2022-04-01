const setCurrentUser = require('../setCurrentUser');

describe('setCurrentUser', () => {
  const next = jest.fn();
  const NAME = 'name';
  let res;
  let req;

  beforeEach(() => {
    res = { locals: {} };
    next.mockClear();
    req = {
      session: {
        isSignedIn: true,
      },
      user: {
        getFullName: jest.fn(() => NAME),
      },
    };
  });

  describe('signed in user', () => {
    beforeEach(() => {
      setCurrentUser(req, res, next);
    });

    it('should use session data to set the signed in status when signed in', () => {
      expect(res.locals.isSignedIn).toBe(true);
      expect(next).toHaveBeenCalled();
    });

    it('should use user object to set the username', () => {
      expect(res.locals.userName).toBe(NAME);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('signed in user', () => {
    beforeEach(() => {
      req.session.isSignedIn = false;
      setCurrentUser(req, res, next);
    });

    it('should use session data to set the signed in status when signed out', () => {
      expect(res.locals.isSignedIn).toBe(false);
      expect(next).toHaveBeenCalled();
    });
  });
});
