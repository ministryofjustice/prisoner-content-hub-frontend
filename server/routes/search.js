const { path } = require('ramda');
const express = require('express');
const i18next = require('i18next');

const createSearchRouter = ({ searchService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    let results = [];
    const query = path(['query', 'query'], req);

    try {
      results = await searchService.find(query, req.session?.establishmentName);
      const language = req.language || i18next.language;

      return res.render('pages/search', {
        title: i18next.t('search.title', { lng: language }),
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
