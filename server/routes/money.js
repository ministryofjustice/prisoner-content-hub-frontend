const { path } = require('ramda');
const express = require('express');

const createMoneyRouter = ({ hubContentService, offenderService, logger }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    logger.info('GET /money');
    try {
      const id = 4201;
      const establishmentId = path(['locals', 'establishmentId'], res);

      const data = await hubContentService.contentFor(id, establishmentId);

      const config = {
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'money',
        returnUrl: req.originalUrl,
      };

      if (req.user) {
        const userName = req.user && req.user.getFullName();
        const { bookingId } = req.user;
        const balances = await offenderService.getBalancesFor(bookingId);
        data.personalisedData = balances;
        config.userName = userName;
      }

      return res.render('pages/category', {
        title: 'Money and Debt',
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
  createMoneyRouter,
};
