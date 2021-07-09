jest.mock('@sentry/node');

const {
  createSignInMiddleware,
  createSignInCallbackMiddleware,
  createSignOutMiddleware,
  isPrisonerId,
  getSafeReturnUrl,
} = require('../middleware');

const AZURE_AD_OAUTH2_STRATEGY = 'azure_ad_oauth2';
const TEST_RETURN_URL = '/foo/bar';
const TEST_CALLBACK_ERROR = new TypeError('user.serialize is not a function');
const TEST_PRISONER_ID = 'A1234BC';
const TEST_INVALID_PRISONER_ID = 'FOOBAR';
const TEST_BOOKING_ID = 1234;
const MOCK_LOGGER = { info: () => {}, error: () => {}, debug: () => {} };

describe('AuthMiddleware', () => {
  describe('createSignInMiddleware', () => {
    it('should return a middleware function', () => {
      const signIn = createSignInMiddleware();
      expect(typeof signIn).toBe('function');
    });

    describe('signIn', () => {
      const passport = { authenticate: jest.fn() };
      const passportAuthenticateMiddleware = jest.fn();
      passport.authenticate.mockReturnValue(passportAuthenticateMiddleware);

      beforeEach(() => {
        passport.authenticate.mockClear();
        passportAuthenticateMiddleware.mockClear();
      });

      it('should call passport.authenticate() with the Azure AD OAuth2 strategy', () => {
        const req = { session: {}, query: {} };

        const signIn = createSignInMiddleware(passport);

        signIn(req, {});

        expect(passport.authenticate).toHaveBeenCalledWith(
          AZURE_AD_OAUTH2_STRATEGY,
        );
        expect(req.session.returnUrl).toBe('/');
      });

      it('should set the returnUrl in the session if passed as a query parameter', () => {
        const req = { session: {}, query: { returnUrl: TEST_RETURN_URL } };

        const signIn = createSignInMiddleware(passport);

        signIn(req, {});

        expect(passport.authenticate).toHaveBeenCalledWith(
          AZURE_AD_OAUTH2_STRATEGY,
        );
        expect(req.session.returnUrl).toBe(TEST_RETURN_URL);
      });

      it('should set the returnUrl to the home page if passed URL is not relative', () => {
        const req = { session: {}, query: { returnUrl: 'http://foo.bar' } };

        const signIn = createSignInMiddleware(passport);

        signIn(req, {});

        expect(passport.authenticate).toHaveBeenCalledWith(
          AZURE_AD_OAUTH2_STRATEGY,
        );
        expect(req.session.returnUrl).toBe('/');
      });
    });
  });

  describe('createSignInCallbackMiddleware', () => {
    it('should return a middleware function', () => {
      const signInCallbackMiddleware = createSignInCallbackMiddleware({
        offenderService: () => {},
        logger: MOCK_LOGGER,
      });
      expect(typeof signInCallbackMiddleware).toBe('function');
    });

    describe('signInCallback', () => {
      const offenderService = { getOffenderDetailsFor: jest.fn() };
      const analyticsService = { sendEvent: jest.fn() };

      const req = {
        session: { passport: { user: 'serialized_user' } },
        logIn: jest.fn(),
      };
      const res = { redirect: jest.fn() };
      const next = jest.fn();

      beforeEach(() => {
        req.logIn.mockClear();
        res.redirect.mockClear();
        offenderService.getOffenderDetailsFor.mockClear();
        next.mockClear();
      });

      it('should pass the error to next if passport.authenticate() returns an error', async () => {
        const authenticate = jest.fn().mockRejectedValue(TEST_CALLBACK_ERROR);

        const signInCallback = createSignInCallbackMiddleware({
          offenderService,
          authenticate,
          analyticsService,
          logger: MOCK_LOGGER,
        });

        await signInCallback(req, res, next);
        expect(next).toHaveBeenCalledWith(TEST_CALLBACK_ERROR);
      });

      it('should pass the error to next if passport.authenticate() returns an error', async () => {
        const authenticate = jest.fn().mockRejectedValue(TEST_CALLBACK_ERROR);

        const signInCallback = createSignInCallbackMiddleware({
          offenderService,
          authenticate,
          analyticsService,
          logger: MOCK_LOGGER,
        });

        await signInCallback(req, res, next);
        expect(next).toHaveBeenCalledWith(TEST_CALLBACK_ERROR);
      });

      it('should redirect to the auth error page if passport.authenticate() returns no user', async () => {
        const authenticate = jest.fn().mockResolvedValue();

        const signInCallback = createSignInCallbackMiddleware({
          offenderService,
          authenticate,
          analyticsService,
          logger: { error: () => {}, debug: () => {} },
        });

        await signInCallback(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/auth/error');
      });

      it('should fetch offender details if passport.authenticate() returns a user with a valid prisoner ID', async () => {
        const user = {
          prisonerId: TEST_PRISONER_ID,
          setBookingId: jest.fn(),
          serialize: jest.fn(),
        };

        const authenticate = jest.fn().mockResolvedValue(user);
        user.serialize.mockReturnValue('serialized_user');

        offenderService.getOffenderDetailsFor.mockResolvedValue({
          bookingId: TEST_BOOKING_ID,
        });

        req.session.returnUrl = '/foo/bar/baz';

        const signInCallback = createSignInCallbackMiddleware({
          offenderService,
          authenticate,
          analyticsService,
          logger: MOCK_LOGGER,
        });

        await signInCallback(req, res, next);
        expect(user.setBookingId).toHaveBeenCalledWith(TEST_BOOKING_ID);
        expect(user.serialize).toHaveBeenCalled();
        expect(req.session.passport.user).toBe(
          'serialized_user',
          'It should have saved the updated user in the session',
        );
        expect(res.redirect).toHaveBeenCalledWith(req.session.returnUrl);
      });

      it('should not fetch offender details if passport.authenticate() returns a user without a valid prisoner ID', async () => {
        const user = {
          prisonerId: TEST_INVALID_PRISONER_ID,
          setBookingId: jest.fn(),
          serialize: jest.fn(),
        };

        const authenticate = jest.fn().mockResolvedValue(user);
        user.serialize.mockReturnValue('serialized_user');

        offenderService.getOffenderDetailsFor.mockResolvedValue();

        req.session.returnUrl = '/foo/bar/baz';

        const signInCallback = createSignInCallbackMiddleware({
          offenderService,
          analyticsService,
          authenticate,
          logger: MOCK_LOGGER,
        });

        await signInCallback(req, res, next);
        expect(offenderService.getOffenderDetailsFor).not.toHaveBeenCalled();
        expect(user.serialize).toHaveBeenCalled();
        expect(req.session.passport.user).toBe(
          'serialized_user',
          'It should have saved the updated user in the session',
        );
        expect(res.redirect).toHaveBeenCalledWith(req.session.returnUrl);
      });
    });
  });

  describe('createSignOutMiddleware', () => {
    it('should return a middleware function', () => {
      const signOut = createSignOutMiddleware({
        logger: MOCK_LOGGER,
      });
      expect(typeof signOut).toBe('function');
    });

    describe('signOut', () => {
      const mockUser = {
        prisonerId: TEST_INVALID_PRISONER_ID,
        setBookingId: jest.fn(),
        serialize: jest.fn(),
      };
      const req = { logOut: jest.fn(), user: mockUser };
      const res = { redirect: jest.fn() };
      const analyticsService = { sendEvent: jest.fn() };

      beforeEach(() => {
        req.logOut.mockClear();
        res.redirect.mockClear();
        req.query = {};
      });

      it('should call logOut and redirect if passed a returnUrl', () => {
        req.query = { returnUrl: TEST_RETURN_URL };

        const signOut = createSignOutMiddleware({
          analyticsService,
          logger: MOCK_LOGGER,
        });

        signOut(req, res);

        expect(req.logOut).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith(TEST_RETURN_URL);
      });

      it('should not fail when already logged out', () => {
        req.query = { returnUrl: TEST_RETURN_URL };

        const signOut = createSignOutMiddleware({
          analyticsService,
          logger: MOCK_LOGGER,
        });

        signOut({ ...req, user: undefined }, res);

        expect(req.logOut).not.toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith(TEST_RETURN_URL);
      });

      it('should call logOut and redirect to the homepage if passed a returnUrl that is not relative', () => {
        req.query = { returnUrl: 'https://foo.bar' };

        const signOut = createSignOutMiddleware({
          analyticsService,
          logger: MOCK_LOGGER,
        });

        signOut(req, res);

        expect(req.logOut).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
      });

      it('should call logOut and redirect to the home page if not passed a returnUrl', () => {
        const signOut = createSignOutMiddleware({
          analyticsService,
          logger: MOCK_LOGGER,
        });

        signOut(req, res);

        expect(req.logOut).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('isPrisonerId', () => {
    it('should return true if a prisoner ID', () => {
      expect(isPrisonerId('A1234BC')).toBe(true);
      expect(isPrisonerId('a1234bc')).toBe(true);
    });
    it('should return false if not a prisoner ID', () => {
      expect(isPrisonerId('Rick Sanchez')).toBe(false);
      expect(isPrisonerId('###A1234BC###')).toBe(false);
      expect(isPrisonerId('')).toBe(false);
      expect(isPrisonerId(null)).toBe(false);
      expect(isPrisonerId(undefined)).toBe(false);
    });
  });

  describe('getSafeReturnUrl', () => {
    it('should return the default when the URL is absolute or protocol-relative', () => {
      expect(getSafeReturnUrl({ returnUrl: 'http://foo.bar/baz' })).toBe('/');
      expect(getSafeReturnUrl({ returnUrl: 'https://foo.bar/baz' })).toBe('/');
      expect(getSafeReturnUrl({ returnUrl: 'http://foo.bar' })).toBe('/');
      expect(getSafeReturnUrl({ returnUrl: 'https://foo.bar' })).toBe('/');
      expect(getSafeReturnUrl({ returnUrl: '//foo.bar' })).toBe('/');
    });

    it('should return the URL when the URL is relative', () => {
      expect(getSafeReturnUrl({ returnUrl: '/foo' })).toBe('/foo');
      expect(getSafeReturnUrl({ returnUrl: '/foo/bar' })).toBe('/foo/bar');
    });

    it('should default to home if no URL is passed', () => {
      expect(getSafeReturnUrl()).toBe('/');
    });

    it('should default to home if argument is not a string', () => {
      expect(getSafeReturnUrl({ returnUrl: ['foo', 'bar'] })).toBe('/');
    });
  });
});
