const express = require('express');
const config = require('../config');

const createAnalyticsRouter = ({ analyticsService }) => {
  const router = express.Router();

  router.post('/event', (req, res) => {
    const sessionId = req?.session?.id;

    analyticsService.sendEvent({
      category: req?.body?.category,
      action: req?.body?.action,
      label: req?.body?.label,
      value: req?.body?.value,
      sessionId,
      userAgent: req?.body?.userAgent,
    });

    return res.send('OK');
  });

  router.post('/page', (req, res) => {
    const sessionId = req.session.id;
    const hostname = `${req.session.establishmentName}.${config.singleHostName}`;

    analyticsService.sendPageTrack({
      hostname,
      page: req?.body?.page,
      title: req?.body?.title,
      sessionId,
      userAgent: req?.body?.userAgent,
      screen: req?.body?.screen,
      viewport: req?.body?.viewport,
      topics: req?.body?.topics,
      categories: req?.body?.categories,
      series: req?.body?.series,
    });

    return res.send('OK');
  });

  return router;
};

module.exports = {
  createAnalyticsRouter,
};
