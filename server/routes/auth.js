const express = require('express');
const passport = require('passport');

const createAuthRouter = () => {
  const router = express.Router();

  router.get('/sign-in', (req, res, next) => {
    if (req.query.returnUrl) {
      req.session.returnUrl = req.query.returnUrl;
    }
    passport.authenticate('azure_ad_oauth2')(req, res, next);
  });

  router.get('/provider/callback', (req, res, next) => {
    passport.authenticate('azure_ad_oauth2', (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/auth/sign-in');
      }
      return req.logIn(user, loginErr => {
        if (loginErr) {
          return next(err);
        }
        return res.redirect(req.session.returnUrl || '/');
      });
    })(req, res, next);
  });

  router.get('/sign-out', (req, res) => {
    req.logOut();
    res.redirect('/');
  });

  return router;
};

module.exports = {
  createAuthRouter,
};
