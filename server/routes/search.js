const { path } = require('ramda');
const express = require('express');

const createSearchRouter = ({ searchService, analyticsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    let results = [];
    const query = path(['query', 'query'], req);
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

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
        data: results,
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
