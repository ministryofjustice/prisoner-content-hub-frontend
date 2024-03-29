/* eslint no-underscore-dangle: ["error", { "allow": ["_passport"] }] */
const _passport = require('passport');
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
    const returnUrl = getSafeReturnUrl(req.query);
    if (req.user) {
      req.session.isSignedIn = true;
      return res.redirect(returnUrl);
    }
    req.session.returnUrl = returnUrl;
    return passport.authenticate('azure_ad_oauth2')(req, res, next);
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
  const pattern = /^[A-Z][0-9]{4}[A-Z]{2}$/i;
  return pattern.test(id);
}

/*
  id        CL   initials  visits  visitors ApprovedVisitors
  G2168GG   WLI  OC        1       1           2
  G9374GG   WLI  YX        1       4           5
  G1727GV   WLI  DB        1       3           32
  G2320VD   WLI  YA        In reception        0
  G2732GG   WLI  ON        0       N/A         4

  G4309UE   CKI  AU        0       N/A         ?

  G5899UC   FMI  AA        0       N/A         ?
*/
const createMockSignIn = ({ offenderService }) =>
  async function mockSignIn(req, res, next) {
    try {
      const user = new User({
        prisonerId: 'G2311GO',
        firstName: 'Test',
        lastName: 'User',
      });

      const { bookingId, agencyId } =
        await offenderService.getOffenderDetailsFor(user);
      user.setBookingId(bookingId);

      if (!req.session?.establishmentName) {
        updateSessionEstablishment(req, agencyId);
        req.session.isSignedIn = false;
      } else {
        req.session.isSignedIn = true;
      }

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
    req.session.isSignedIn = false;

    res.redirect(getSafeReturnUrl(req.query));
  };

const createSignInCallbackMiddleware = ({
  logger,
  offenderService,
  authenticate = _authenticate,
}) =>
  async function signInCallback(req, res, next) {
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
        if (!req.session?.establishmentName) {
          updateSessionEstablishment(req, agencyId);
          req.session.isSignedIn = false;
        } else {
          req.session.isSignedIn = true;
        }
      }
      req.session.passport.user = user.serialize();

      return res.redirect(req.session.returnUrl);
    } catch (e) {
      e.message = `SignInCallbackMiddleware (signInCallback) - Failed: ${e.message}`;

      return next(e);
    }
  };

const createSignOutMiddleware = ({ logger }) =>
  function signOut(req, res) {
    if (req.session?.isSignedIn) {
      logger.info(`SignOutMiddleware (signOut) - User: ${req.user.prisonerId}`);
      req.session.isSignedIn = false;
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
