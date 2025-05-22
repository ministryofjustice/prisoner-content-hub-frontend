const i18next = require('i18next');

const express = require('express');

const createRecentlyAddedContentRouter = ({ cmsService }) => {
  const router = express.Router();

  const getMostRecentContent = req => {
    const { establishmentName } = req.session;

    if (!establishmentName) {
      throw new Error('Could not determine establishment!');
    }

    const { page } = req.query;

    return cmsService.getRecentlyAddedContent(establishmentName, page, 40);
  };

  router.get('/', async (req, res, next) => {
    try {
      const hubContentData = await getMostRecentContent(req);

      const language = req.language || i18next.language;

      res.render('pages/collections', {
        config: {
          content: true,
        },
        title: i18next.t('recentlyAdded.title', { lng: language }),
        data: {
          hubContentData,
          summary: i18next.t('recentlyAdded.summary', { lng: language }),
          breadcrumbs: [
            { href: '/', text: 'Home' },
            { href: '', text: 'Recently added' },
          ],
        },
      });
    } catch (e) {
      e.message = `Error loading content: ${e.message}`;
      next(e);
    }
  });

  router.get('/json', async (req, res, next) => {
    try {
      const hubContentData = await getMostRecentContent(req);

      res.json(hubContentData);
    } catch (e) {
      e.message = `Error loading content: ${e.message}`;
      next(e);
    }
  });

  return router;
};

module.exports = {
  createRecentlyAddedContentRouter,
};
