const { path } = require('ramda');
const express = require('express');
const { subDays } = require('date-fns');
const { formatTransactionPageData } = require('./formatters');

function getAccountCodeFor(accountType) {
  const accountCodes = {
    spends: 'spends',
    private: 'cash',
    savings: 'savings',
  };

  return accountCodes[accountType];
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
      const templateData = {
        title: 'Your transactions',
        config: {
          content: false,
          header: false,
          postscript: true,
          detailsType: 'small',
          returnUrl: req.originalUrl,
        },
      };

      const { user } = req;

      if (user) {
        const accountTypes = ['spends', 'private', 'savings'];
        const accountType = accountTypes.includes(req.query.accountType)
          ? req.query.accountType
          : accountTypes[0];
        const accountCode = getAccountCodeFor(accountType);

        const toDate = new Date();
        const fromDate = subDays(toDate, 30);

        const transactionsData = await prisonerInformationService.getTransactionInformationFor(
          user,
          accountCode,
          fromDate,
          toDate,
        );

        const prisonerInformation = formatTransactionPageData(
          accountCode,
          transactionsData,
        );
        prisonerInformation.selected = accountType;
        prisonerInformation.accountTypes = accountTypes;

        templateData.prisonerInformation = prisonerInformation;
        templateData.config.userName = user.getFullName();
      }

      return res.render('pages/transactions', templateData);
    } catch (e) {
      return next(e);
    }
  });

  return router;
};

module.exports = {
  createMoneyRouter,
};
