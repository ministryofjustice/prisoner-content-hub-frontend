const express = require('express');

const { createHomepageRouter } = require('./homepage');
const { createTopicsRouter } = require('./topics');
const { createTimetableRouter } = require('./timetable');
const { createContentRouter } = require('./content');
const { createTagRouter } = require('./tags');
const { createLinkRouter } = require('./link');
const { createGamesRouter } = require('./games');
const { createFeedbackRouter } = require('./feedback');
const { createSearchRouter } = require('./search');
const { createNprRouter } = require('./npr');
const { createHelpRouter } = require('./help');
const { createRecentlyAddedContentRouter } = require('./recentlyAdded');
const { createUpdatesContentRouter } = require('./updates');
const createPrimaryNavigationMiddleware = require('../middleware/primaryNavigationMiddleware');
const retrieveTopicList = require('../middleware/retrieveTopicList');
const urgentBannerMiddleware = require('../middleware/urgentBannerMiddleware');

module.exports = (
  {
    logger,
    cmsService,
    offenderService,
    searchService,
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
      '/games',
      '^/search/?$',
      '/recently-added',
      '/updates',
    ],
    [
      createPrimaryNavigationMiddleware(cmsService),
      retrieveTopicList(cmsService),
      urgentBannerMiddleware(cmsService),
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
    '/content',
    createContentRouter({
      cmsService,
    }),
  );

  router.use('/npr', createNprRouter());
  router.use('/tags', createTagRouter({ cmsService }));
  router.use('/link', createLinkRouter({ cmsService }));
  router.use('/games', createGamesRouter());
  router.use('/feedback', createFeedbackRouter({ feedbackService }));
  router.use('/search', createSearchRouter({ searchService }));

  router.use('/help', createHelpRouter());

  router.use(
    '/recently-added',
    createRecentlyAddedContentRouter({ cmsService }),
  );

  router.use('/updates', createUpdatesContentRouter({ cmsService }));

  router.use('*', (req, res) => {
    res.status(404);
    res.render('pages/404');
  });

  return router;
};
