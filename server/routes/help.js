const express = require('express');

const { getEstablishmentIsYoi } = require('../utils');
const defaultKnownPages = require('../content/knownPages.json');

const createHelpRouter = (
  establishmentData,
  { helpLinkYoi, helpLinkAdult } = defaultKnownPages,
) => {
  const router = express.Router();

  router.get('/', (req, res) =>
    res.redirect(
      getEstablishmentIsYoi(req.session?.establishmentId, establishmentData)
        ? helpLinkYoi
        : helpLinkAdult,
    ),
  );

  return router;
};

module.exports = {
  createHelpRouter,
};
