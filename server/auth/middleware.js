// eslint-disable-next-line no-underscore-dangle
const _passport = require('passport');

const createSignInMiddleware = (passport = _passport) => {
  return function signIn(req, res, next) {
    req.session.returnUrl = req.query.returnUrl || '/';
    passport.authenticate('azure_ad_oauth2')(req, res, next);
  };
};

const createSignInCallbackMiddleware = (
  { offenderService },
  passport = _passport,
) => {
  return async function signInCallback(req, res, next) {
    passport.authenticate('azure_ad_oauth2', async (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/auth/sign-in');
      }
      const { bookingId } = await offenderService.getOffenderDetailsFor(
        user.prisonerId,
      );
      user.setBookingId(bookingId);
      return req.logIn(user, loginErr => {
        if (loginErr) {
          return next(err);
        }
        return res.redirect(req.session.returnUrl);
      });
    })(req, res, next);
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
};
