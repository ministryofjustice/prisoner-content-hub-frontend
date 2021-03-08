const { path } = require('ramda');
const express = require('express');
const { subDays } = require('date-fns');
const { formatBalanceOrDefault } = require('../utils/string');
const { formatDateOrDefault } = require('../utils/date');

function formatTransaction(t) {
  return {
    paymentDate: formatDateOrDefault('', 'd MMMM yyyy', t.entryDate),
    balance: formatBalanceOrDefault(null, t.currentBalance / 100, t.currency),
    moneyIn:
      t.postingType === 'CR'
        ? formatBalanceOrDefault(null, t.penceAmount / 100, t.currency)
        : null,
    moneyOut:
      t.postingType === 'DR'
        ? formatBalanceOrDefault(null, t.penceAmount / 100, t.currency)
        : null,
    paymentDescription: t.entryDescription,
    prison: t.prison,
  };
}

function getAccountCodeFor(accountType) {
  const accountCodes = {
    spends: 'spends',
    private: 'cash',
    savings: 'savings',
  };

  return accountCodes[accountType];
}

function formatBalanceFor(accountType, balances) {
  const balance = balances[getAccountCodeFor(accountType)];
  return formatBalanceOrDefault(null, balance, balances.currency);
}

const createMoneyRouter = ({
  hubContentService,
  offenderService,
  prisonerInformationService,
}) => {
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

        const toDate = new Date();
        const fromDate = subDays(toDate, 30);

        const prisonerInformation = await prisonerInformationService.getTransactionInformationFor(
          user,
          getAccountCodeFor(accountType),
          fromDate,
          toDate,
        );

        if (prisonerInformation) {
          data.transactions = prisonerInformation.transactions.error
            ? prisonerInformation.transactions
            : prisonerInformation.transactions.map(formatTransaction);
          data.balance = prisonerInformation.balances.error
            ? prisonerInformation.balances
            : {
                amount: formatBalanceFor(
                  accountType,
                  prisonerInformation.balances,
                ),
              };
        }

        data.selected = accountType;
        data.accountTypes = accountTypes;
        config.userName = user.getFullName();
      }

      return res.render('pages/transactions', {
        title: 'Your transactions',
        config,
        data,
      });
    } catch (e) {
      return next(e);
    }
  });

  return router;
};

module.exports = {
  createMoneyRouter,
};
