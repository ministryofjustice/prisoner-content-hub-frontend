const express = require('express');

const createTopicsRouter = ({ topicsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const userName = req.user?.getFullName();
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const topics = await topicsService.getTopics(establishmentName);

      res.render('pages/topics', {
        title: 'Browse the Content Hub',
        allTopics: topics,
        config: {
          content: false,
          header: false,
          postscript: true,
          detailsType: 'small',
          userName,
          returnUrl: req.originalUrl,
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
