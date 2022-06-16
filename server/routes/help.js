const express = require('express');

const defaultKnownPages = require('../content/knownPages.json');

const createHelpRouter = ({ helpLink } = defaultKnownPages) => {
  const router = express.Router();

  router.get('/', (req, res) => res.redirect(helpLink));

  return router;
};

module.exports = {
  createHelpRouter,
};
