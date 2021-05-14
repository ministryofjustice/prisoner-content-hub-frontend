const express = require('express');
const { path } = require('ramda');
const Sentry = require('@sentry/node');
const { logger } = require('../utils/logger');

const fixUrls = element => {
  const { id, description, href, linkText } = element;
  switch (element.href) {
    // TODO: Re-enable when Incentives personalization feature released
    // case '/content/4204':
    //   return { id, description, href: '/incentives', linkText };
    default:
      return { id, description, href, linkText };
  }
};

const createTopicsRouter = ({ topicsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const userName = req.user && req.user.getFullName();
      const establishmentId = path(['session', 'establishmentId'], req);
      const topics = await topicsService.getTopics(establishmentId);

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
        allTopics: topics.map(fixUrls),
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
