const express = require('express');
const { path, pathOr } = require('ramda');
const passport = require('passport');

const createAuthRouter = () => {
  const router = express.Router();
  router.get('/sign-in', passport.authenticate('azure_ad_oauth2'));
  router.get('/provider/callback', passport.authenticate('azure_ad_oauth2', { successRedirect: '/' }));


  router.get('/sign-out', (req, res) => res.send('TODO'));

  return router;
}

module.exports = {
  createAuthRouter,
};
