const express = require('express');
const Sentry = require('@sentry/node');
const { logger } = require('../utils/logger');

const createTopicsRouter = ({ topicsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const userName = req.user && req.user.getFullName();
      const { establishmentId, establishmentName } = req.session;
      const topics = await topicsService.getTopics(
        establishmentId && establishmentName,
      );

      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        userName,
        returnUrl: req.originalUrl,
      };

      res.render('pages/topics', {
        title: 'Browse the Content Hub',
        allTopics: topics,
        config,
      });
    } catch (e) {
      logger.error(`Error loading topics: ${e.message}`);
      Sentry.captureException(e);
      next(e);
    }
  });

  return router;
};

module.exports = {
  createTopicsRouter,
};
