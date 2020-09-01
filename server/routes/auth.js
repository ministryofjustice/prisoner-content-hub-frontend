const express = require('express');

const createAuthRouter = ({ signIn, signInCallback, signOut }) => {
  const router = express.Router();

  router.get('/sign-in', signIn);

  router.get('/provider/callback', signInCallback);

  router.get('/sign-out', signOut);

  return router;
};

module.exports = {
  createAuthRouter,
};
