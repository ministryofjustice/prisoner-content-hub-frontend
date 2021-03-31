const { path } = require('ramda');
const express = require('express');
const { startOfMonth, parseISO, endOfMonth, isFuture } = require('date-fns');
const {
  createTransactionsResponseFrom,
  createDamageObligationsResponseFrom,
  createPendingTransactionsResponseFrom,
} = require('./formatters');
const { getDateSelection } = require('../utils/date');

const accountTypes = ['spends', 'private', 'savings'];

function isValidDateSelection(selectedDate, dateSelection) {
  return dateSelection.filter(d => selectedDate === d.value).length > 0;
}

function processSelectedDate(selectedDate) {
  const dateSelection = getDateSelection(new Date(), parseISO(selectedDate));
  const fromDate = isValidDateSelection(selectedDate, dateSelection)
    ? parseISO(selectedDate)
    : startOfMonth(new Date());
  const endOfSelectedMonth = endOfMonth(fromDate);
  const toDate = !isFuture(endOfSelectedMonth)
    ? endOfSelectedMonth
    : new Date();

  return {
    dateSelection,
    fromDate,
    toDate,
  };
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
          accountTypes,
        };
        templateData.config.userName = user.getFullName();
      }

      return res.render('pages/damage-obligations', templateData);
    } catch (e) {
      return next(e);
    }
  });

  router.get(
    ['/transactions', '/transactions/spends'],
    async (req, res, next) => {
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
          const accountCode = 'spends';

          const { selectedDate } = req.query;
          const { dateSelection, fromDate, toDate } = processSelectedDate(
            selectedDate,
          );

          const transactionsData = await prisonerInformationService.getTransactionsFor(
            user,
            accountCode,
            fromDate,
            toDate,
          );

          if (!transactionsData) {
            return next(new Error('Failed to fetch transaction data'));
          }

          const { transactions, balances } = transactionsData;

          const {
            transactions: formattedTransactions,
            balance: formattedBalances,
            shouldShowDamageObligationsTab,
          } = createTransactionsResponseFrom(accountCode, {
            transactions,
            balances,
          });

          templateData.prisonerInformation = {
            transactions: formattedTransactions,
            balance: formattedBalances,
            shouldShowDamageObligationsTab,
            selected: accountCode,
            accountTypes,
            selectedDate,
            dateSelection,
          };

          templateData.config.userName = user.getFullName();
        }

        return res.render('pages/transactions', templateData);
      } catch (e) {
        return next(e);
      }
    },
  );

  router.get('/transactions/savings', async (req, res, next) => {
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
        const accountCode = 'savings';

        const { selectedDate } = req.query;
        const { dateSelection, fromDate, toDate } = processSelectedDate(
          selectedDate,
        );

        const transactionsData = await prisonerInformationService.getTransactionsFor(
          user,
          accountCode,
          fromDate,
          toDate,
        );

        if (!transactionsData) {
          return next(new Error('Failed to fetch transaction data'));
        }

        const { transactions, balances } = transactionsData;

        const {
          transactions: formattedTransactions,
          balance: formattedBalances,
          shouldShowDamageObligationsTab,
        } = createTransactionsResponseFrom(accountCode, {
          transactions,
          balances,
        });

        templateData.prisonerInformation = {
          transactions: formattedTransactions,
          balance: formattedBalances,
          shouldShowDamageObligationsTab,
          selected: accountCode,
          accountTypes,
          selectedDate,
          dateSelection,
        };

        templateData.config.userName = user.getFullName();
      }

      return res.render('pages/transactions', templateData);
    } catch (e) {
      return next(e);
    }
  });

  router.get('/transactions/private', async (req, res, next) => {
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
        const { selectedDate } = req.query;
        const { dateSelection, fromDate, toDate } = processSelectedDate(
          selectedDate,
        );

        const transactionsData = await prisonerInformationService.getPrivateTransactionsFor(
          user,
          fromDate,
          toDate,
        );

        if (!transactionsData) {
          return next(new Error('Failed to fetch transaction data'));
        }

        const { transactions, balances, pending } = transactionsData;

        const {
          transactions: formattedTransactions,
          balance: formattedBalances,
          shouldShowDamageObligationsTab,
        } = createTransactionsResponseFrom('cash', {
          transactions,
          balances,
        });

        const formattedPendingTransactions = createPendingTransactionsResponseFrom(
          pending,
        );

        templateData.prisonerInformation = {
          transactions: formattedTransactions,
          balance: formattedBalances,
          pendingTransactions: formattedPendingTransactions,
          shouldShowDamageObligationsTab,
          selected: 'private',
          accountTypes,
          selectedDate,
          dateSelection,
        };

        templateData.config.userName = user.getFullName();
      }

      return res.render('pages/transactions-private', templateData);
    } catch (e) {
      return next(e);
    }
  });

  return router;
};

module.exports = {
  createMoneyRouter,
};
