const { path } = require('ramda');
const express = require('express');

const createIepRouter = ({ hubContentService, offenderService, logger }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    logger.info('GET /iep');
    try {
      const id = 4204;
      const establishmentId = path(['locals', 'establishmentId'], res);

      const data = await hubContentService.contentFor(id, establishmentId);

      const config = {
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'iep',
        returnUrl: req.originalUrl,
      };

      if (req.user) {
        const userName = req.user && req.user.getFullName();
        const { bookingId } = req.user;
        const iep = await offenderService.getIEPSummaryFor(bookingId);
        data.personalisedData = iep;
        config.userName = userName;
      }

      return res.render('pages/category', {
        title: 'Incentives',
        config,
        data,
      });
    } catch (exp) {
      return next(exp);
    }
  });

  return router;
};

module.exports = {
  createIepRouter,
};
