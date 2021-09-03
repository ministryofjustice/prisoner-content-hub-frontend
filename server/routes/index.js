const express = require('express');

const { createHomepageRouter } = require('./homepage');
const { createTopicsRouter } = require('./topics');
const { createTimetableRouter } = require('./timetable');
const { createContentRouter } = require('./content');
const { createMoneyRouter } = require('./money');
const { createApprovedVisitorsRouter } = require('./approvedVisitors');
const { createProfileRouter } = require('./profile');
const { createTagRouter } = require('./tags');
const { createGamesRouter } = require('./games');
const { createAnalyticsRouter } = require('./analytics');
const { createFeedbackRouter } = require('./feedback');
const { createSearchRouter } = require('./search');
const { createNprRouter } = require('./npr');

module.exports = (
  {
    logger,
    cmsService,
    hubContentService,
    hubTagsService,
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
      hubContentService,
      analyticsService,
    }),
  );

  router.use('/npr', createNprRouter());
  router.use('/tags', createTagRouter({ hubTagsService }));
  router.use('/games', createGamesRouter());
  router.use('/analytics', createAnalyticsRouter({ analyticsService }));
  router.use('/feedback', createFeedbackRouter({ feedbackService }));
  router.use(
    '/search',
    createSearchRouter({ searchService, analyticsService }),
  );

  router.use('*', (req, res) => {
    res.status(404);
    res.render('pages/404');
  });

  return router;
};
