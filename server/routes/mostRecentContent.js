const express = require('express');

const createMostRecentContentRouter = ({ cmsService }) => {
  const router = express.Router();

  const buildResponse = (req, res, relatedContent, respondWithJson) =>
    respondWithJson
      ? res.json(relatedContent)
      : res.render('pages/collections', {
          config: {
            content: true,
          },
          title: 'Recently added',
          data: {
            relatedContent,
            summary: 'The latest uploads on the Hub.',
          },
          breadcrumbs: ['test'],
        });

  router.get('/:json?', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const { page } = req.query;
      const respondWithJson = req.params.json;

      const relatedContent = await cmsService.getMostRecentContent(
        establishmentName,
        page,
        40,
      );

      buildResponse(req, res, relatedContent, respondWithJson);
    } catch (e) {
      e.message = `Error loading content: ${e.message}`;
      next(e);
    }
  });

  return router;
};

module.exports = {
  createMostRecentContentRouter,
};
