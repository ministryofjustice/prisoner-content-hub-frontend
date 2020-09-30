const redis = require('redis');
const { path } = require('ramda');
const { createApp } = require('./app');
const { logger, requestLogger } = require('./utils/logger');
const config = require('./config');

const { HubClient } = require('./clients/hub');
const { StandardClient } = require('./clients/standard');
const { PrisonApiClient } = require('./clients/prisonApiClient');
const {
  RedisCachingStrategy,
  InMemoryCachingStrategy,
} = require('./utils/caching');

// Services
const { createHubMenuService } = require('./services/hubMenu');
const {
  createHubFeaturedContentService,
} = require('./services/hubFeaturedContent');
const { createHubContentService } = require('./services/hubContent');
const { createHealthService } = require('./services/health');
const { createHubTagsService } = require('./services/hubTags');
const { createPrisonApiOffenderService } = require('./services/offender');
const { createSearchService } = require('./services/search');
const { createAnalyticsService } = require('./services/analytics');
const { createFeedbackService } = require('./services/feedback');

// Repositories
const {
  hubFeaturedContentRepository,
} = require('./repositories/hubFeaturedContent');
const {
  categoryFeaturedContentRepository,
} = require('./repositories/categoryFeaturedContent');
const { hubMenuRepository } = require('./repositories/hubMenu');
const { contentRepository } = require('./repositories/hubContent');
const { offenderRepository } = require('./repositories/offender');
const { searchRepository } = require('./repositories/search');
const { analyticsRepository } = require('./repositories/analytics');
const { feedbackRepository } = require('./repositories/feedback');

const hubClient = new HubClient();
const standardClient = new StandardClient();

const cachingStrategy = path(['features', 'useRedisCache'], config)
  ? new RedisCachingStrategy(
      config.caching.secret,
      redis.createClient(config.caching.redis),
    )
  : new InMemoryCachingStrategy();

module.exports = createApp({
  logger,
  requestLogger,
  healthService: createHealthService({
    client: standardClient,
    config,
    logger,
  }),
  hubFeaturedContentService: createHubFeaturedContentService(
    hubFeaturedContentRepository(hubClient),
  ),
  hubMenuService: createHubMenuService(
    hubMenuRepository(hubClient, standardClient),
  ),
  hubContentService: createHubContentService({
    contentRepository: contentRepository(hubClient),
    menuRepository: hubMenuRepository(hubClient),
    categoryFeaturedContentRepository: categoryFeaturedContentRepository(
      hubClient,
    ),
  }),
  hubTagsService: createHubTagsService(contentRepository(hubClient)),
  offenderService: createPrisonApiOffenderService(
    offenderRepository(
      new PrisonApiClient({
        prisonApi: config.prisonApi,
        cachingStrategy,
      }),
    ),
  ),
  searchService: createSearchService({
    searchRepository: searchRepository(standardClient),
  }),
  analyticsService: createAnalyticsService({
    analyticsRepository: analyticsRepository(standardClient),
  }),
  feedbackService: createFeedbackService({
    feedbackRepository: feedbackRepository(standardClient),
  }),
});
