const express = require('express');

const { createHomepageRouter } = require('./homepage');
const { createTopicsRouter } = require('./topics');
const { createTimetableRouter } = require('./timetable');
const { createContentRouter } = require('./content');
const { createMoneyRouter } = require('./money');
const { createApprovedVisitorsRouter } = require('./approvedVisitors');
const { createProfileRouter } = require('./profile');
const { createTagRouter } = require('./tags');
const { createLinkRouter } = require('./link');
const { createGamesRouter } = require('./games');
const { createAnalyticsRouter } = require('./analytics');
const { createFeedbackRouter } = require('./feedback');
const { createSearchRouter } = require('./search');
const { createNprRouter } = require('./npr');
const { createHelpRouter } = require('./help');
const { createRecentlyAddedContentRouter } = require('./recentlyAdded');
const createPrimaryNavigationMiddleware = require('../middleware/primaryNavigationMiddleware');
const retrieveTopicList = require('../middleware/retrieveTopicList');

module.exports = (
  {
    logger,
    cmsService,
    offenderService,
    prisonerInformationService,
    searchService,
    analyticsService,
    feedbackService,
    config,
  },
  establishmentData,
) => {
  const router = express.Router();

  router.use(
    [
      '^/$',
      '/content',
      '/npr',
      '/tags',
      '/topics',
      '/timetable',
      '/money',
      '/approved-visitors',
      '/profile',
      '/games',
      '^/search/?$',
      '/recently-added',
      '/new-homepage',
    ],
    [
      createPrimaryNavigationMiddleware(cmsService),
      retrieveTopicList(cmsService),
    ],
  );

  router.use(
    '/',
    createHomepageRouter({
      logger,
      cmsService,
      offenderService,
      config,
      establishmentData,
    }),
  );

  router.use('/topics', createTopicsRouter({ cmsService }));

  router.use('/timetable', createTimetableRouter({ offenderService }));

  router.use(
    '/money',
    createMoneyRouter({
      prisonerInformationService,
    }),
  );

  router.use(
    '/approved-visitors',
    createApprovedVisitorsRouter({
      offenderService,
    }),
  );

  router.use(
    '/profile',
    createProfileRouter({
      offenderService,
    }),
  );

  router.use(
    '/content',
    createContentRouter({
      cmsService,
      analyticsService,
    }),
  );

  router.use('/npr', createNprRouter());
  router.use('/tags', createTagRouter({ cmsService }));
  router.use('/link', createLinkRouter({ cmsService }));
  router.use('/games', createGamesRouter());
  router.use('/analytics', createAnalyticsRouter({ analyticsService }));
  router.use('/feedback', createFeedbackRouter({ feedbackService }));
  router.use(
    '/search',
    createSearchRouter({ searchService, analyticsService }),
  );

  router.use('/help', createHelpRouter());

  router.use(
    '/recently-added',
    createRecentlyAddedContentRouter({ cmsService }),
  );

  router.use('*', (req, res) => {
    res.status(404);
    res.render('pages/404');
  });

  return router;
};
