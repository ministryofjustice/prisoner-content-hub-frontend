const { logger } = require('../utils/logger');
const config = require('../config');

const { StandardClient } = require('../clients/standard');
const { JsonApiClient } = require('../clients/jsonApiClient');

const { InMemoryCachingStrategy } = require('../utils/caching/memory');
const RedisCachingStrategy = require('../utils/caching/redisClient');

// Repositories
const { feedbackRepository } = require('../repositories/feedback');
const { CmsApi } = require('../repositories/cmsApi');

// Services
const { CmsService } = require('./cms');
const { createSearchService } = require('./search');
const { createFeedbackService } = require('./feedback');

const cmsCachingStrategy = config?.features?.useRedisCache
  ? new RedisCachingStrategy()
  : new InMemoryCachingStrategy();
const jsonApiClient = new JsonApiClient(config.api.hubEndpoint);
const standardClient = new StandardClient();
const cmsApi = new CmsApi({
  jsonApiClient,
  cachingStrategy: cmsCachingStrategy,
});
const cmsService = new CmsService({
  cmsApi,
  cachingStrategy: cmsCachingStrategy,
});

module.exports = {
  logger,
  cmsService,
  searchService: createSearchService({ cmsApi }),
  feedbackService: createFeedbackService({
    feedbackRepository: feedbackRepository(standardClient),
  }),
};
