const { path } = require('ramda');
const express = require('express');
const config = require('../config');

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

      let dateTimeCacheTest;
      if (
        config.features.approvedVisitorsFeatureEnabled &&
        req.headers.referer.includes('/approved-visitors')
      ) {
        res.set('Cache-Control', 'public, max-age=86400');
        res.removeHeader('Expires');
        res.removeHeader('Pragma');
        dateTimeCacheTest = new Date().toLocaleString();
      }

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
        dateTimeCacheTest,
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
