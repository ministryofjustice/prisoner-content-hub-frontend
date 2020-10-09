const {
  createSignInMiddleware,
  createSignInCallbackMiddleware,
  createSignOutMiddleware,
  isPrisonerId,
} = require('../../server/auth/middleware');

const AZURE_AD_OAUTH2_STRATEGY = 'azure_ad_oauth2';
const TEST_RETURN_URL = '/foo/bar';
const TEST_CALLBACK_ERROR = new Error('BOOM!');
const TEST_PRISONER_ID = 'A1234BC';
const TEST_INVALID_PRISONER_ID = 'FOOBAR';
const TEST_BOOKING_ID = 1234;
const MOCK_LOGGER = { info: () => {}, error: () => {}, debug: () => {} };

describe('AuthMiddleware', () => {
  describe('createSignInMiddleware', () => {
    it('should return a middleware function', () => {
      const signIn = createSignInMiddleware();
      expect(typeof signIn).to.equal('function');
    });

    describe('signIn', () => {
      const passport = { authenticate: sinon.stub() };
      const passportAuthenticateMiddleware = sinon.stub();
      passport.authenticate.returns(passportAuthenticateMiddleware);

      beforeEach(() => {
        passport.authenticate.resetHistory();
        passportAuthenticateMiddleware.resetHistory();
      });

      it('should call passport.authenticate() with the Azure AD OAuth2 strategy', () => {
        const req = { session: {}, query: {} };

        const signIn = createSignInMiddleware(passport);

        signIn(req, {});

        expect(passport.authenticate).to.have.been.calledWith(
          AZURE_AD_OAUTH2_STRATEGY,
        );
        expect(req.session.returnUrl).to.equal('/');
      });

      it('should set the returnUrl in the session if passed as a query parameter', () => {
        const req = { session: {}, query: { returnUrl: TEST_RETURN_URL } };

        const signIn = createSignInMiddleware(passport);

        signIn(req, {});

        expect(passport.authenticate).to.have.been.calledWith(
          AZURE_AD_OAUTH2_STRATEGY,
        );
        expect(req.session.returnUrl).to.equal(TEST_RETURN_URL);
      });
    });
  });

  describe('createSignInCallbackMiddleware', () => {
    it('should return a middleware function', () => {
      const signInCallbackMiddleware = createSignInCallbackMiddleware({
        offenderService: () => {},
        logger: MOCK_LOGGER,
      });
      expect(typeof signInCallbackMiddleware).to.equal('function');
    });

    describe('signInCallback', () => {
      const offenderService = { getOffenderDetailsFor: sinon.stub() };
      const analyticsService = { sendEvent: sinon.stub() };

      const req = {
        session: { passport: { user: 'serialized_user' } },
        logIn: sinon.stub(),
      };
      const res = { redirect: sinon.stub() };
      const next = sinon.spy();

      beforeEach(() => {
        req.logIn.resetHistory();
        res.redirect.resetHistory();
        offenderService.getOffenderDetailsFor.resetHistory();
        next.resetHistory();
      });

      it('should pass the error to next if passport.authenticate() returns an error', async () => {
        const authenticate = sinon.stub().rejects(TEST_CALLBACK_ERROR);

        const signInCallback = createSignInCallbackMiddleware({
          offenderService,
          authenticate,
          analyticsService,
          logger: MOCK_LOGGER,
        });

        await signInCallback(req, res, next);
        expect(next).to.have.been.calledWith(TEST_CALLBACK_ERROR);
      });

      it('should redirect to the auth error page if passport.authenticate() returns no user', async () => {
        const authenticate = sinon.stub().resolves();

        const signInCallback = createSignInCallbackMiddleware({
          offenderService,
          authenticate,
          analyticsService,
          logger: { error: () => {}, debug: () => {} },
        });

        await signInCallback(req, res, next);
        expect(res.redirect).to.have.been.calledWith('/auth/error');
      });

      it('should fetch offender details if passport.authenticate() returns a user with a valid prisoner ID', async () => {
        const user = {
          prisonerId: TEST_PRISONER_ID,
          setBookingId: sinon.stub(),
          serialize: sinon.stub(),
        };

        const authenticate = sinon.stub().resolves(user);
        user.serialize.returns('serialized_user');

        offenderService.getOffenderDetailsFor.resolves({
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
        expect(user.setBookingId).to.have.been.calledWith(TEST_BOOKING_ID);
        expect(user.serialize).to.have.been.called;
        expect(req.session.passport.user).to.equal(
          'serialized_user',
          'It should have saved the updated user in the session',
        );
        expect(res.redirect).to.have.been.calledWith(req.session.returnUrl);
      });

      it('should not fetch offender details if passport.authenticate() returns a user without a valid prisoner ID', async () => {
        const user = {
          prisonerId: TEST_INVALID_PRISONER_ID,
          setBookingId: sinon.stub(),
          serialize: sinon.stub(),
        };

        const authenticate = sinon.stub().resolves(user);
        user.serialize.returns('serialized_user');

        offenderService.getOffenderDetailsFor.resolves();

        req.session.returnUrl = '/foo/bar/baz';

        const signInCallback = createSignInCallbackMiddleware({
          offenderService,
          analyticsService,
          authenticate,
          logger: MOCK_LOGGER,
        });

        await signInCallback(req, res, next);
        expect(offenderService.getOffenderDetailsFor).to.not.have.been.called;
        expect(user.serialize).to.have.been.called;
        expect(req.session.passport.user).to.equal(
          'serialized_user',
          'It should have saved the updated user in the session',
        );
        expect(res.redirect).to.have.been.calledWith(req.session.returnUrl);
      });
    });
  });

  describe('createSignOutMiddleware', () => {
    it('should return a middleware function', () => {
      const signOut = createSignOutMiddleware({
        logger: MOCK_LOGGER,
      });
      expect(typeof signOut).to.equal('function');
    });

    describe('signOut', () => {
      const mockUser = {
        prisonerId: TEST_INVALID_PRISONER_ID,
        setBookingId: sinon.stub(),
        serialize: sinon.stub(),
      };
      const req = { logOut: sinon.stub(), user: mockUser };
      const res = { redirect: sinon.stub() };
      const analyticsService = { sendEvent: sinon.stub() };

      beforeEach(() => {
        req.logOut.resetHistory();
        res.redirect.resetHistory();
        req.query = {};
      });

      it('should call logOut and redirect if passed a returnUrl', () => {
        req.query = { returnUrl: TEST_RETURN_URL };

        const signOut = createSignOutMiddleware({
          analyticsService,
          logger: MOCK_LOGGER,
        });

        signOut(req, res);

        expect(req.logOut).to.have.been.called;
        expect(res.redirect).to.have.been.calledWith(TEST_RETURN_URL);
      });

      it('should call logOut and redirect to the home page if not passed a returnUrl', () => {
        const signOut = createSignOutMiddleware({
          analyticsService,
          logger: MOCK_LOGGER,
        });

        signOut(req, res);

        expect(req.logOut).to.have.been.called;
        expect(res.redirect).to.have.been.calledWith('/');
      });
    });
  });

  describe('isPrisonerId', () => {
    it('should return true if a prisoner ID', () => {
      expect(isPrisonerId('A1234BC')).to.equal(true);
      expect(isPrisonerId('a1234bc')).to.equal(true);
    });
    it('should return false if not a prisoner ID', () => {
      expect(isPrisonerId('Rick Sanchez')).to.equal(false);
      expect(isPrisonerId('###A1234BC###')).to.equal(false);
      expect(isPrisonerId('')).to.equal(false);
      expect(isPrisonerId(null)).to.equal(false);
      expect(isPrisonerId(undefined)).to.equal(false);
    });
  });
});
