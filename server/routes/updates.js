const express = require('express');

const createUpdatesContentRouter = ({ cmsService }) => {
  const router = express.Router();

  const getUpdatesContent = (req, res) => {
    const { establishmentName } = req.session;

    if (!establishmentName) {
      throw new Error('Could not determine establishment!');
    }

    const { page } = req.query;
    const { currentLng } = res.locals;

    return cmsService.getUpdatesContent(
      establishmentName,
      currentLng,
      page,
      40,
    );
  };

  router.get('/', async (req, res, next) => {
    try {
      const { updatesContent, isLastPage = true } = await getUpdatesContent(
        req,
        res,
      );

      res.render('pages/collections', {
        config: {
          content: true,
        },
        title: 'Updates',
        data: {
          hubContentData: {
            data: updatesContent,
            isLastPage,
          },
          summary: 'The latest updates on the Hub.',
          breadcrumbs: [
            { href: '/', text: 'Home' },
            { href: '', text: 'Updates' },
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
      const { updatesContent: hubContentData, isLastPage } =
        await getUpdatesContent(req.res);

      res.json({
        data: hubContentData,
        isLastPage,
      });
    } catch (e) {
      e.message = `Error loading content: ${e.message}`;
      next(e);
    }
  });

  return router;
};

module.exports = {
  createUpdatesContentRouter,
};
