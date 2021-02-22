const { path } = require('ramda');
const express = require('express');
const { subDays, formatISO } = require('date-fns');

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
        const accountTypes = ['spends', 'private', 'savings'];
        const accountType = accountTypes.includes(req.query.accountType)
          ? req.query.accountType
          : accountTypes[0];
        const accountTypeMachineName = {
          spends: 'spends',
          private: 'cash',
          savings: 'savings',
        };

        const transactionsTo = new Date();
        const transactionsFrom = subDays(transactionsTo, 30);

        const [transactions, balances] = await Promise.all([
          offenderService.getTransactionsFor(
            user,
            accountTypeMachineName[accountType],
            formatISO(transactionsFrom, { representation: 'date' }),
            formatISO(transactionsTo, { representation: 'date' }),
          ),
          offenderService.getBalancesFor(user),
        ]);

        const listOfPrisons = Array.from(
          new Set(transactions.map(transaction => transaction.prison)),
        );
        const prisonDetails = await Promise.all(
          listOfPrisons.map(prisonId =>
            offenderService.getPrisonDetailsFor(prisonId),
          ),
        );
        const prisonDetailsLookup = prisonDetails.reduce(
          (accumulator, prison) => {
            if (Object.hasOwnProperty.call(accumulator, prison.prisonId)) {
              return accumulator;
            }
            const updated = { ...accumulator };
            updated[prison.prisonId] = prison.longDescription;
            return updated;
          },
          {},
        );

        data.transactions = transactions.map(transaction => ({
          ...transaction,
          prison: prisonDetailsLookup[transaction.prison],
        }));
        data.balance = balances[accountType];
        data.selected = accountType;
        data.accountTypes = accountTypes;
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
