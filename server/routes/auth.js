const express = require('express');
const { path, pathOr } = require('ramda');
const passport = require('passport');

const createAuthRouter = () => {
  const router = express.Router();

  router.get('/sign-in', (req, res, next) => {
    if (req.query.returnUrl) { req.session.returnUrl = req.query.returnUrl; }
    passport.authenticate('azure_ad_oauth2')(req, res, next);
  });

  router.get('/provider/callback', (req, res, next) => {
    passport.authenticate('azure_ad_oauth2', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/auth/sign-in'); }
      req.logIn(user, err => {
        if (err) { return next(err); }
        return res.redirect(req.session.returnUrl || '/');
      })
    })(req, res, next);
  });

  router.get('/sign-out', (req, res) => res.send('TODO'));

  return router;
}

module.exports = {
  createAuthRouter,
};
