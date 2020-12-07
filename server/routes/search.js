const express = require('express');

const createSearchRouter = ({ searchService, analyticsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const establishmentId = req?.session?.establishmentId;

    let results = [];
    const query = req?.query?.query;
    const userName = req.user && req.user.getFullName();
    const sessionId = req?.session?.id;
    const userAgent = req?.headers?.['user-agent'];
    const config = {
      content: false,
      header: false,
      postscript: false,
      detailsType: 'small',
      userName,
      returnUrl: req.originalUrl,
    };

    try {
      results = await searchService.find({ query, establishmentId });
      analyticsService.sendEvent({
        category: 'Search',
        action: query,
        label: JSON.stringify(results),
        value: results.length,
        sessionId,
        userAgent,
      });

      return res.render('pages/search', {
        title: 'Search',
        config,
        data: results,
        query,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/suggest', async (req, res) => {
    const establishmentId = req?.session?.establishmentId;
    const query = req?.query?.query;

    try {
      const results = await searchService.typeAhead({
        query,
        establishmentId,
      });

      return res.json(results);
    } catch (error) {
      return res.status(500).json([]);
    }
  });

  return router;
};

module.exports = {
  createSearchRouter,
};
