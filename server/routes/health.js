const express = require('express');

const createHealthRouter = () => {
  const router = express.Router();

  router.get('/', (_, res) => res.json({ status: 'OK' }));
  router.get('/readiness', (_, res) => res.json({ status: 'OK' }));

  return router;
};

module.exports = {
  createHealthRouter,
};
