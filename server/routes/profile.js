const express = require('express');

const createProfileRouter = ({ offenderService }) => {
  const router = express.Router();

  const getPersonalisation = async user => {
    const [eventsSummary, incentivesSummary, visitsSummary, moneySummary] =
      await Promise.all([
        offenderService.getEventsForToday(user),
        offenderService.getIncentivesSummaryFor(user),
        offenderService.getVisitsFor(user),
        offenderService.getBalancesFor(user),
      ]);

    const signedInUser = user.getFullName();

    const {
      morning,
      afternoon,
      evening,
      error: timetableError,
    } = eventsSummary;

    const {
      incentivesLevel,
      reviewDate,
      error: incentivesError,
    } = incentivesSummary;

    const {
      nextVisit,
      visitType,
      visitorName,
      hasNextVisit,
      startTime,
      endTime,
      error: visitsError,
    } = visitsSummary;

    const { spends, privateAccount, savings, error: moneyError } = moneySummary;

    return {
      signedInUser,
      eventsSummary: {
        error: timetableError,
        morning,
        afternoon,
        evening,
        link: '/timetable',
      },

      incentivesSummary: {
        error: incentivesError,
        incentivesLevel,
        reviewDate,
        link: '/content/4204',
      },
      visitsSummary: {
        error: visitsError,
        hasNextVisit,
        nextVisit,
        visitType,
        visitorName,
        startTime,
        endTime,
        link: '/content/4203',
      },
      moneySummary: {
        error: moneyError,
        spends,
        privateAccount,
        savings,
        contentLink: '/content/4201',
        transactionsLink: '/money/transactions',
      },
    };
  };

  router.get('/', async (req, res, next) => {
    try {
      const { user } = req;
      const personalisation = user ? await getPersonalisation(user) : {};

      return res.render('pages/profile', {
        title: 'Your profile',
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'profile',
        returnUrl: req.originalUrl,
        ...personalisation,
      });
    } catch (e) {
      return next(e);
    }
  });

  return router;
};

module.exports = {
  createProfileRouter,
};
