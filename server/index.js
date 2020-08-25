const redis = require('redis');
const { path } = require('ramda');
const { createApp } = require('./app');
const { logger } = require('./utils/logger');
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
const {
  createHubPromotedContentService,
} = require('./services/hubPromotedContent');
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
const {
  promotedContentRepository,
} = require('./repositories/hubPromotedContent');
const { hubMenuRepository } = require('./repositories/hubMenu');
const { contentRepository } = require('./repositories/hubContent');
const { offenderRepository } = require('./repositories/offender');
const { searchRepository } = require('./repositories/search');
const { analyticsRepository } = require('./repositories/analytics');
const { feedbackRepository } = require('./repositories/feedback');

// Connect services with repositories
const hubMenuService = createHubMenuService(
  hubMenuRepository(new HubClient(), new StandardClient()),
);
const hubFeaturedContentService = createHubFeaturedContentService(
  hubFeaturedContentRepository(new HubClient()),
);
const hubPromotedContentService = createHubPromotedContentService(
  promotedContentRepository(new HubClient()),
);
const hubContentService = createHubContentService({
  contentRepository: contentRepository(new HubClient()),
  menuRepository: hubMenuRepository(new HubClient()),
  categoryFeaturedContentRepository: categoryFeaturedContentRepository(
    new HubClient(),
  ),
});
const hubTagsService = createHubTagsService(contentRepository(new HubClient()));

const cachingStrategy = path(['features', 'useRedisCache'], config)
  ? new RedisCachingStrategy(
      config.caching.secret,
      redis.createClient(config.caching.redis),
    )
  : new InMemoryCachingStrategy();

const offenderService = createPrisonApiOffenderService(
  offenderRepository(
    new PrisonApiClient({
      prisonApi: config.prisonApi,
      cachingStrategy,
    }),
  ),
);
const searchService = createSearchService({
  searchRepository: searchRepository(new StandardClient()),
});
const analyticsService = createAnalyticsService({
  analyticsRepository: analyticsRepository(new StandardClient()),
});
const feedbackService = createFeedbackService({
  feedbackRepository: feedbackRepository(new StandardClient()),
});

const app = createApp({
  healthService: createHealthService({
    client: new StandardClient(),
    config,
    logger,
  }),
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
  hubMenuService,
  hubContentService,
  hubTagsService,
  offenderService,
  searchService,
  analyticsService,
  feedbackService,
});

module.exports = app;
