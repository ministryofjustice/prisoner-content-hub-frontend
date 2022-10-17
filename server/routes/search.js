const express = require('express');
const { logger } = require('../services');

const createSearchRouter = ({ searchService, analyticsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    let results = [];
    const query = req.query?.query;
    const sessionId = req.session?.id;
    const userAgent = req.headers?.['user-agent'];
    const establishmentName = req.session?.establishmentName;

    logger.info(`ROUTE SEARCH >>>>>>> ${establishmentName} ${query}`);

    try {
      results = await searchService.find({ query, establishmentName });
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
    const query = req.query?.query;
    const establishmentName = req.session?.establishmentName;
    logger.info(`ROUTE TYPEAHEAD >>>>>>> ${establishmentName} ${query}`);
    try {
      const results = await searchService.typeAhead({
        query,
        establishmentName,
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
