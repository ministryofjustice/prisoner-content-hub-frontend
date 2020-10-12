// eslint-disable-next-line no-underscore-dangle
const _passport = require('passport');
const { path } = require('ramda');

const createSignInMiddleware = (passport = _passport) => {
  return function signIn(req, res, next) {
    req.session.returnUrl = req.query.returnUrl || '/';
    passport.authenticate('azure_ad_oauth2')(req, res, next);
  };
};

// eslint-disable-next-line no-underscore-dangle
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

const createSignInCallbackMiddleware = ({
  logger,
  offenderService,
  analyticsService,
  authenticate = _authenticate,
}) => {
  return async function signInCallback(req, res, next) {
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
        const { bookingId } = await offenderService.getOffenderDetailsFor(user);
        user.setBookingId(bookingId);
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
      logger.error(
        `SignInCallbackMiddleware (signInCallback) - Failed: ${e.message}`,
      );
      logger.debug(e.stack);

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
};

const createSignOutMiddleware = ({ logger, analyticsService }) => {
  return function signOut(req, res) {
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
    res.redirect(req.query.returnUrl || '/');
  };
};

module.exports = {
  createSignInMiddleware,
  createSignInCallbackMiddleware,
  createSignOutMiddleware,
  isPrisonerId,
  _authenticate,
};
