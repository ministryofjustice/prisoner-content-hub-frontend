const express = require('express');
const { path } = require('ramda');

const createHealthRouter = ({ healthService }) => {
  const router = express.Router();

  router.get('/', (_, res) => res.json({ status: 'OK' }));
  router.get('/liveness', (_, res) => res.json({ status: 'OK' }));

  router.get('/readiness', async (req, res, next) => {
    try {
      const healthStatus = await healthService.status();
      const buildInfo = path(['app', 'locals', 'config', 'buildInfo'], req);
      res.set('Content-Language', 'en-GB');
      res.json({
        buildNumber: path(['buildNumber'], buildInfo),
        gitRef: path(['gitRef'], buildInfo),
        gitDate: path(['gitDate'], buildInfo),
        ...healthStatus,
      });
    } catch (exp) {
      next(exp);
    }
  });

  return router;
};

module.exports = {
  createHealthRouter,
};
