const express = require('express');
const fs = require('fs');

const createInfoRouter = establishmentData => {
  const router = express.Router();

  router.get('/', (_, res) =>
    res.json({
      ...displayActiveAgencies(establishmentData),
      ...displayBuildInfo(),
      productId: 'DPS101',
    }),
  );
  return router;
};

function displayActiveAgencies(establishmentData) {
  const activeAgencies = Object.values(establishmentData)
    .filter(establishment => establishment.active)
    .map(establishment => establishment.agencyId);
  return { activeAgencies };
}

function displayBuildInfo() {
  try {
    const { gitBranch, buildNumber } = fs.readFileSync('../../build-info.json');
    return {
      git: { branch: gitBranch },
      build: { version: buildNumber },
    };
  } catch {
    return {};
  }
}

module.exports = {
  createInfoRouter,
};
