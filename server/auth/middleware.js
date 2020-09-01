// eslint-disable-next-line no-underscore-dangle
const _passport = require('passport');

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

const createSignInCallbackMiddleware = ({
  offenderService,
  authenticate = _authenticate,
}) => {
  return async function signInCallback(req, res, next) {
    try {
      const user = await authenticate(req, res, next);

      if (!user) {
        return res.redirect('/auth/sign-in');
      }

      const { bookingId } = await offenderService.getOffenderDetailsFor(
        user.prisonerId,
      );
      user.setBookingId(bookingId);
      req.session.passport.user = user.serialize();
      return res.redirect(req.session.returnUrl);
    } catch (e) {
      return next(e);
    }
  };
};

const createSignOutMiddleware = () => {
  return function signOut(req, res) {
    req.logOut();
    res.redirect(req.query.returnUrl || '/');
  };
};

module.exports = {
  createSignInMiddleware,
  createSignInCallbackMiddleware,
  createSignOutMiddleware,
  _authenticate,
};
