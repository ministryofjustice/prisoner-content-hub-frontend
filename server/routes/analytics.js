const { path } = require('ramda');
const express = require('express');

const createAnalyticsRouter = ({ analyticsService }) => {
  const router = express.Router();

  router.post('/event', (req, res) => {
    const sessionId = path(['session', 'id'], req);

    analyticsService.sendEvent({
      category: path(['body', 'category'], req),
      action: path(['body', 'action'], req),
      label: path(['body', 'label'], req),
      value: path(['body', 'value'], req),
      sessionId,
      userAgent: path(['body', 'userAgent'], req),
    });

    return res.send('OK');
  });

  router.post('/page', (req, res) => {
    const sessionId = path(['session', 'id'], req);

    analyticsService.sendPageTrack({
      hostname: path(['body', 'hostname'], req),
      page: path(['body', 'page'], req),
      title: path(['body', 'title'], req),
      sessionId,
      userAgent: path(['body', 'userAgent'], req),
      screen: path(['body', 'screen'], req),
      viewport: path(['body', 'viewport'], req),
      secondaryTags: path(['body', 'secondaryTags'], req),
      categories: path(['body', 'categories'], req),
      series: path(['body', 'series'], req),
    });

    return res.send('OK');
  });

  return router;
};

module.exports = {
  createAnalyticsRouter,
};
