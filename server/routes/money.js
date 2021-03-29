const { path } = require('ramda');
const express = require('express');
const { startOfMonth, parseISO, endOfMonth, isFuture } = require('date-fns');
const {
  createTransactionsResponseFrom,
  createDamageObligationsResponseFrom,
  createPendingTransactionsResponseFrom,
} = require('./formatters');
const { getDateSelection } = require('../utils/date');

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

  router.get('/damage-obligations', async (req, res, next) => {
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
        const damageObligations = await prisonerInformationService.getDamageObligationsFor(
          user,
        );

        templateData.prisonerInformation = {
          damageObligations: createDamageObligationsResponseFrom(
            damageObligations,
          ),
          selected: 'damage-obligations',
          accountTypes: ['spends', 'private', 'savings'],
        };
        templateData.config.userName = user.getFullName();
      }

      return res.render('pages/transactions', templateData);
    } catch (e) {
      return next(e);
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

        const isValidDateSelection = (selectedDate, dateSelection) =>
          dateSelection.filter(d => selectedDate === d.value).length > 0;

        const { selectedDate } = req.query;
        const dateSelection = getDateSelection(
          new Date(),
          parseISO(selectedDate),
        );
        const fromDate = isValidDateSelection(selectedDate, dateSelection)
          ? parseISO(selectedDate)
          : startOfMonth(new Date());
        const endOfSelectedMonth = endOfMonth(fromDate);
        const toDate = !isFuture(endOfSelectedMonth)
          ? endOfSelectedMonth
          : new Date();

        const transactionsData = await prisonerInformationService.getTransactionInformationFor(
          user,
          accountCode,
          fromDate,
          toDate,
        );

        if (!transactionsData) {
          return next('Failed to fetch transaction data');
        }

        const {
          transactions,
          balances,
          ...otherInformation
        } = transactionsData;
        const formatted = createTransactionsResponseFrom(accountCode, {
          transactions,
          balances,
        });

        const prisonerInformation = {};
        prisonerInformation.transactions = formatted.transactions;
        prisonerInformation.balance = formatted.balance;
        prisonerInformation.shouldShowDamageObligationsTab =
          formatted.shouldShowDamageObligationsTab;
        prisonerInformation.selected = accountType;
        prisonerInformation.accountTypes = accountTypes;
        prisonerInformation.selectedDate = selectedDate;
        prisonerInformation.dateSelection = dateSelection;

        if (accountType === 'private') {
          prisonerInformation.pendingTransactions = createPendingTransactionsResponseFrom(
            otherInformation.pending,
          );
        }

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
