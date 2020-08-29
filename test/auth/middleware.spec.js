const {
  createSignInMiddleware,
  createSignInCallbackMiddleware,
  createSignOutMiddleware,
} = require('../../server/auth/middleware');

const AZURE_AD_OAUTH2_STRATEGY = 'azure_ad_oauth2';
const TEST_RETURN_URL = '/foo/bar';
const TEST_CALLBACK_ERROR = 'BOOM!';
const TEST_PRISONER_ID = 'A1234BC';
const TEST_BOOKING_ID = 1234;

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
      });
      expect(typeof signInCallbackMiddleware).to.equal('function');
    });

    describe('signInCallback', () => {
      const passport = {};
      const passportAuthenticateMiddleware = sinon.stub();
      const offenderService = { getOffenderDetailsFor: sinon.stub() };

      const req = { session: {}, logIn: sinon.stub() };
      const res = { redirect: sinon.stub() };
      const next = sinon.stub();

      beforeEach(() => {
        passport.authenticate = sinon.stub();
        passportAuthenticateMiddleware.resetHistory();
        offenderService.getOffenderDetailsFor.resetHistory();
        req.logIn.resetHistory();
        res.redirect.resetHistory();
        next.resetHistory();
      });

      it('should call passport.authenticate() with the Azure AD OAuth2 strategy', () => {
        const signInCallback = createSignInCallbackMiddleware(
          { offenderService },
          passport,
        );
        passport.authenticate.returns(passportAuthenticateMiddleware);

        signInCallback(req, res);

        expect(passport.authenticate).to.have.been.calledWith(
          AZURE_AD_OAUTH2_STRATEGY,
        );
      });

      it('should pass the error to next if passport.authenticate() returns an error', done => {
        const signInCallback = createSignInCallbackMiddleware(
          { offenderService },
          passport,
        );

        passport.authenticate = async (strategy, callback) => {
          try {
            expect(strategy).to.equal(AZURE_AD_OAUTH2_STRATEGY);
            await callback(TEST_CALLBACK_ERROR);
            expect(next).to.have.been.calledWith(TEST_CALLBACK_ERROR);
            done();
          } catch (failedAssertion) {
            done(failedAssertion);
          }
        };

        signInCallback(req, res, next);
      });

      it('should redirect to the sign in page if passport.authenticate() returns no user', done => {
        const signInCallback = createSignInCallbackMiddleware(
          { offenderService },
          passport,
        );

        passport.authenticate = async (strategy, callback) => {
          try {
            expect(strategy).to.equal(AZURE_AD_OAUTH2_STRATEGY);
            await callback(null);
            expect(res.redirect).to.have.been.calledWith('/auth/sign-in');
            done();
          } catch (failedAssertion) {
            done(failedAssertion);
          }
        };

        signInCallback(req, res, next);
      });

      it('should fetch offender details if passport.authenticate() returns a user', done => {
        const user = {
          prisonerId: TEST_PRISONER_ID,
          setBookingId: sinon.stub(),
        };
        const signInCallback = createSignInCallbackMiddleware(
          { offenderService },
          passport,
        );
        offenderService.getOffenderDetailsFor.resolves({
          bookingId: TEST_BOOKING_ID,
        });

        passport.authenticate = async (strategy, callback) => {
          try {
            expect(strategy).to.equal(AZURE_AD_OAUTH2_STRATEGY);
            await callback(null, user);
            expect(
              offenderService.getOffenderDetailsFor,
            ).to.have.been.calledWith(TEST_PRISONER_ID);
            expect(user.setBookingId).to.have.been.calledWith(TEST_BOOKING_ID);
            expect(req.logIn).to.have.been.called;
            done();
          } catch (failedAssertion) {
            done(failedAssertion);
          }
        };

        signInCallback(req, res, next);
      });
    });
  });

  describe('createSignOutMiddleware', () => {
    it('should return a middleware function', () => {
      const signOut = createSignOutMiddleware();
      expect(typeof signOut).to.equal('function');
    });

    describe('signOut', () => {
      const req = { logOut: sinon.stub() };
      const res = { redirect: sinon.stub() };

      beforeEach(() => {
        req.logOut.resetHistory();
        res.redirect.resetHistory();
        req.query = {};
      });

      it('should call logOut and redirect if passed a returnUrl', () => {
        req.query = { returnUrl: TEST_RETURN_URL };

        const signOut = createSignOutMiddleware();

        signOut(req, res);

        expect(req.logOut).to.have.been.called;
        expect(res.redirect).to.have.been.calledWith(TEST_RETURN_URL);
      });

      it('should call logOut and redirect to the home page if not passed a returnUrl', () => {
        const signOut = createSignOutMiddleware();

        signOut(req, res);

        expect(req.logOut).to.have.been.called;
        expect(res.redirect).to.have.been.calledWith('/');
      });
    });
  });
});
