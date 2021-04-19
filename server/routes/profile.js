const express = require('express');

const createProfileRouter = ({ offenderService }) => {
  const router = express.Router();

  const getPersonalisation = async user => {
    const [events, incentivesSummary, visitsSummary, moneySummary] = await Promise.all([
      offenderService.getEventsForToday(user),
      offenderService.getIncentivesSummaryFor(user),
      offenderService.getVisitsFor(user),
      offenderService.getBalancesFor(user),
    ]);

    const { morning, afternoon, evening, error: timetableError } = events;
    const signedInUser = user.getFullName();
    const {
      incentivesLevel,
      reviewDate,
      error: incentivesError,
    } = incentivesSummary;
    const {
      nextVisit,
      visitType,
      visitorName,
      error: visitsError,
    } = visitsSummary;
    const {
      spends,
      private ,
      savings,
      error: moneyError,
    } = moneySummary;


  console.log(moneySummary);


    return {
      signedInUser,
      events: { error: timetableError, morning, afternoon, evening },
      incentivesSummary: {
        error: incentivesError,
        incentivesLevel,
        reviewDate,
        link: '/incentives',
      },
      visitsSummary: {
        error: visitsError,
        nextVisit,
        visitType,
        visitorName,
        link: '/visits',
      },
      moneySummary: {
        error: moneyError,
        spends,
        private,
        savings,
        link: '/money',
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
