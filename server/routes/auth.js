const express = require('express');

const createAuthRouter = ({ signIn, signInCallback, signOut }) => {
  const router = express.Router();

  router.get('/sign-in', signIn);

  router.get('/provider/callback', signInCallback);

  router.get('/sign-out', signOut);

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('/error', (req, res) => {
    config.detailsType = 'small';
    res.locals.userName = req.user?.getFullName();
    return res.render('pages/authError', {
      title: 'Authentication Error',
      config,
    });
  });

  return router;
};

module.exports = {
  createAuthRouter,
};
