const express = require('express');
// const { groupBy } = require('../utils');

const createMostRecentContentRouter = ({ cmsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const { data, isLastPage } = await cmsService.getMostRecentContent(
        establishmentName,
        1,
        10,
      );

      res.render('pages/mostRecentContent', {
        config: {
          content: true,
        },
        title: 'Recently added',
        data,
        isLastPage,
        breadcrumbs: ['test'],
      });
    } catch (e) {
      e.message = `Error loading topics: ${e.message}`;
      next(e);
    }
  });

  return router;
};

module.exports = {
  createMostRecentContentRouter,
};
