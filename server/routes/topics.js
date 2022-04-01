const express = require('express');
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

      res.render('pages/topics', {
        title: 'Browse all topics',
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
