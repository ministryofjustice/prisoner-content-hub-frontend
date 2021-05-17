const express = require('express');

const createHealthRouter = ({ buildInfo: build }) => {
  const router = express.Router();

  router.get('/', (_, res) => res.json(addAppInfo({ healthy: true }, build)));
  router.get('/readiness', (_, res) => res.json({ status: 'OK' }));

  return router;
};

function addAppInfo(result, build) {
  const buildInfo = {
    uptime: process.uptime(),
    build,
    version: build && build.buildNumber,
  };

  return { ...result, ...buildInfo };
}

module.exports = {
  createHealthRouter,
};
