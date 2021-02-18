const { path } = require('ramda');
const express = require('express');

const createMoneyRouter = ({ hubContentService, offenderService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const id = 4201;
      const establishmentId = path(['session', 'establishmentId'], req);

      const data = await hubContentService.contentFor(id, establishmentId);

      const config = {
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'money',
        returnUrl: req.originalUrl,
      };

      const { user } = req;

      if (user) {
        const balances = await offenderService.getBalancesFor(user);
        data.personalisedData = balances;
        config.userName = user.getFullName();
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

  router.get('/transactions', async (req, res, next) => {
    try {
      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        returnUrl: req.originalUrl,
      };

      const { user } = req;

      const data = {};

      if (user) {
        const transactions = await offenderService.getTransactionsFor(
          user,
          'spends',
          '2021-01-16',
          '2021-02-12',
        );
        data.transactions = transactions;
        config.userName = user.getFullName();
      }

      return res.render('pages/transactions', {
        title: 'Transactions',
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
