const express = require('express');
const config = require('../config');
const { createBreadcrumbs } = require('../utils/breadcrumbs');

const createProfileRouter = ({ offenderService }) => {
  const router = express.Router();

  const getPersonalisation = async user => {
    const [
      eventsSummary,
      incentivesSummary,
      visitsSummary,
      visitsBalances,
      moneySummary,
      adjudications,
    ] = await Promise.all([
      offenderService.getEventsForToday(user),
      offenderService.getIncentivesSummaryFor(user),
      offenderService.getVisitsFor(user),
      offenderService.getVisitsRemaining(user),
      offenderService.getBalancesFor(user),
      offenderService.getAdjudicationsFor(user),
    ]);

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
      visitors,
      hasNextVisit,
      startTime,
      endTime,
      error: visitsError,
    } = visitsSummary;

    const { visitsRemaining = 0, error: visitsRemainingError = false } =
      visitsBalances;

    const { spends, privateAccount, savings, error: moneyError } = moneySummary;

    return {
      eventsSummary: {
        error: timetableError,
        morning,
        afternoon,
        evening,
      },

      incentivesSummary: {
        error: incentivesError,
        incentivesLevel,
        reviewDate,
      },
      visitsSummary: {
        error: visitsError || visitsRemainingError,
        hasNextVisit,
        nextVisit,
        visitType,
        visitors,
        startTime,
        endTime,
        visitsRemaining,
      },
      moneySummary: {
        error: moneyError,
        spends,
        privateAccount,
        savings,
      },
      hasAdjudications: adjudications.length > 0,
    };
  };

  router.get('/', async (req, res, next) => {
    try {
      const { user } = req;
      const personalisation = user ? await getPersonalisation(user) : {};

      return res.render('pages/profile', {
        title: 'My profile',
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        data: { contentType: 'profile', breadcrumbs: createBreadcrumbs(req) },
        ...personalisation,
        displayApprovedVisitorsCard:
          config.features.approvedVisitorsFeatureEnabled,
        displayAdjudicationsFeature:
          config.features.adjudicationsFeatureEnabled &&
          config.features.adjudicationsFeatureEnabledAt.includes(
            req.session.establishmentName,
          ) &&
          personalisation.hasAdjudications,
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
