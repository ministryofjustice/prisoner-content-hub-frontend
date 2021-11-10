/* eslint no-underscore-dangle: ["error", { "allow": ["_passport"] }] */
const _passport = require('passport');
const { path } = require('ramda');
const { User } = require('./user');
const { updateSessionEstablishment } = require('../utils');

const getSafeReturnUrl = ({ returnUrl = '/' } = {}) =>
  // type-check to mitigate "type confusion through parameter tampering", where an attacker
  // coerces the param to an array to bypass the indexOf checks
  typeof returnUrl !== 'string' ||
  returnUrl.indexOf('://') > 0 ||
  returnUrl.indexOf('//') === 0
    ? '/'
    : returnUrl;

const createSignInMiddleware = (passport = _passport) =>
  function signIn(req, res, next) {
    req.session.returnUrl = getSafeReturnUrl(req.query);
    passport.authenticate('azure_ad_oauth2')(req, res, next);
  };

/* eslint no-underscore-dangle: ["error", { "allow": ["_passport", "_authenticate"] }] */
const _authenticate = (req, res, next) =>
  new Promise((resolve, reject) => {
    _passport.authenticate('azure_ad_oauth2', (err, user) => {
      if (err) {
        reject(err);
      }

      req.logIn(user, loginErr =>
        loginErr ? reject(loginErr) : resolve(user),
      );
    })(req, res, next);
  });

function isPrisonerId(id) {
  const pattern = new RegExp(/^[A-Z][0-9]{4}[A-Z]{2}$/i);
  return pattern.test(id);
}

/*
   id        initials  visits  visitors ApprovedVisitors
  G2168GG   OC        1       1           2
  G9374GG   YX        1       4           5
  G1727GV   DB        1       3           32
  G2320VD   YA        In reception        0
  G2732GG   ON        0       N/A         4
*/
const createMockSignIn = ({ offenderService }) =>
  async function mockSignIn(req, res, next) {
    try {
      const user = new User({
        prisonerId: 'G2168GG',
        firstName: 'Test',
        lastName: 'User',
      });

      const { bookingId, agencyId } =
        await offenderService.getOffenderDetailsFor(user);
      user.setBookingId(bookingId);

      updateSessionEstablishment(req, agencyId);

      req.session.passport = {
        user: user.serialize(),
      };

      res.redirect(getSafeReturnUrl(req.query));
    } catch (e) {
      next(e);
    }
  };

const createMockSignOut = () =>
  function mockSignOut(req, res) {
    const user = path(['session', 'passport', 'user'], req);

    if (user) {
      delete req.session.passport.user;
    }
    res.redirect(getSafeReturnUrl(req.query));
  };

const createSignInCallbackMiddleware = ({
  logger,
  offenderService,
  analyticsService,
  authenticate = _authenticate,
}) =>
  async function signInCallback(req, res, next) {
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['body', 'userAgent'], req);
    try {
      const user = await authenticate(req, res, next);
      if (!user) {
        return res.redirect('/auth/error');
      }

      logger.info(
        `SignInCallbackMiddleware (signInCallback) - User: ${user.prisonerId}`,
      );

      if (isPrisonerId(user.prisonerId)) {
        const { bookingId, agencyId } =
          await offenderService.getOffenderDetailsFor(user);
        user.setBookingId(bookingId);

        updateSessionEstablishment(req, agencyId);
      }
      req.session.passport.user = user.serialize();

      analyticsService.sendEvent({
        category: 'Signin',
        action: 'signin',
        label: 'success',
        value: 1,
        sessionId,
        userAgent,
      });

      return res.redirect(req.session.returnUrl);
    } catch (e) {
      e.message = `SignInCallbackMiddleware (signInCallback) - Failed: ${e.message}`;

      analyticsService.sendEvent({
        category: 'Signin',
        action: 'signin',
        label: 'failure',
        value: 1,
        sessionId,
        userAgent,
      });

      return next(e);
    }
  };

const createSignOutMiddleware = ({ logger, analyticsService }) =>
  function signOut(req, res) {
    if (req.user?.isSignedIn()) {
      logger.info(`SignOutMiddleware (signOut) - User: ${req.user.prisonerId}`);
      req.logOut();
      analyticsService.sendEvent({
        category: 'Signin',
        action: 'signout',
        label: 'success',
        value: 1,
        sessionId: path(['session', 'id'], req),
        userAgent: path(['body', 'userAgent'], req),
      });
    }
    res.redirect(getSafeReturnUrl(req.query));
  };

module.exports = {
  createSignInMiddleware,
  createSignInCallbackMiddleware,
  createSignOutMiddleware,
  createMockSignIn,
  createMockSignOut,
  isPrisonerId,
  getSafeReturnUrl,
  _authenticate,
};
