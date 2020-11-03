const { path } = require('ramda');
const express = require('express');

const createSearchRouter = ({ searchService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const establishmentId = path(['session', 'establishmentId'], req);

    let results = [];
    const query = path(['query', 'query'], req);
    const userName = req.user && req.user.getFullName();
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
    const establishmentId = path(['session', 'establishmentId'], req);
    const query = path(['query', 'query'], req);

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
