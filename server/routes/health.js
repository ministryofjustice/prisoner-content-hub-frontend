const express = require('express');

const createHealthRouter = () => {
  const router = express.Router();

  router.get('/', (_, res) => res.json(addAppInfo({ healthy: true })));
  router.get('/readiness', (_, res) => res.json({ status: 'OK' }));

  return router;
};

function addAppInfo(result) {
  const buildInformation = getBuild();
  const buildInfo = {
    uptime: process.uptime(),
    build: buildInformation,
    version: buildInformation && buildInformation.buildNumber,
  };

  return { ...result, ...buildInfo };
}

function getBuild() {
  try {
    // eslint-disable-next-line import/no-unresolved,global-require
    return require('../../build-info.json');
  } catch (ex) {
    return null;
  }
}

module.exports = {
  createHealthRouter,
};
