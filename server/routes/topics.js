const express = require('express');
const i18next = require('i18next');
const { groupBy } = require('../utils');

const createTopicsRouter = ({ cmsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const topics = await cmsService.getTopics(establishmentName);
      // We have to sort the results even though we specified a sort order in
      // the JSON:API request.
      // See https://www.drupal.org/project/drupal/issues/3186834.
      topics.sort((a, b) => {
        if (a.linkText > b.linkText) {
          return 1;
        }
        if (b.linkText > a.linkText) {
          return -1;
        }
        return 0;
      });

      const language = req.language || i18next.language;

      res.render('pages/topics', {
        title: i18next.t('home.browseAllTopics', { lng: language }),
        topics: groupBy(topics, item => item.linkText.charAt(0).toUpperCase()),
        config: {
          content: false,
          header: false,
          postscript: true,
          detailsType: 'small',
        },
      });
    } catch (e) {
      e.message = `Error loading topics: ${e.message}`;
      next(e);
    }
  });

  return router;
};

module.exports = {
  createTopicsRouter,
};
