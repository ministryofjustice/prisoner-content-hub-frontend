const express = require('express');

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
    const sessionId = req?.session?.id;

    analyticsService.sendPageTrack({
      hostname: req?.body?.hostname,
      page: req?.body?.page,
      title: req?.body?.title,
      sessionId,
      userAgent: req?.body?.userAgent,
      screen: req?.body?.screen,
      viewport: req?.body?.viewport,
      secondaryTags: req?.body?.secondaryTags,
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
