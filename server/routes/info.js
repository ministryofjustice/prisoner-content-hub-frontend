const express = require('express');

const createInfoRouter = (establishmentData) => {
  const router = express.Router();

  router.get('/', (_, res) => res.json(displayActiveAgencies(establishmentData)));
  return router;
};

function displayActiveAgencies(establishmentData) {
  const activeAgencies = Object.values(establishmentData).filter(establishment => establishment.active).map(establishment => establishment.agencyId)
  return { activeAgencies };
}

module.exports = {
  createInfoRouter,
};
