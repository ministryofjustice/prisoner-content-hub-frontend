const express = require('express');

const createSearchRouter = ({ searchService, analyticsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    let results = [];
    const query = req?.query?.query;
    const sessionId = req?.session?.id;
    const userAgent = req?.headers['user-agent'];

    try {
      results = await searchService.find(query, req.session?.establishmentName);
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
        config: {
          content: false,
          header: false,
          postscript: false,
          detailsType: 'small',
        },
        results,
        data: { contentType: 'search' },
        query,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/suggest', async (req, res) => {
    try {
      const results = await searchService.typeAhead(
        req.query?.query,
        req.session?.establishmentName,
      );

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
