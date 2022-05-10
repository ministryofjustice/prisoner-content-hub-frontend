const express = require('express');

const createMostRecentContentRouter = ({ cmsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const relatedContent = await cmsService.getMostRecentContent(
        establishmentName,
        1,
        5,
      );

      res.render('pages/collections', {
        config: {
          content: true,
        },
        title: 'Recently added',
        data: { relatedContent },
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
