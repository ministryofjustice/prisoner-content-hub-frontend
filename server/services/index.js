const { logger } = require('../utils/logger');
const config = require('../config');

const { StandardClient } = require('../clients/standard');
const { PrisonApiClient } = require('../clients/prisonApiClient');
const { IncentivesApiClient } = require('../clients/incentivesApiClient');
const { JsonApiClient } = require('../clients/jsonApiClient');

const { InMemoryCachingStrategy } = require('../utils/caching/memory');
const RedisCachingStrategy = require('../utils/caching/redisClient');

// Repositories
const { offenderRepository } = require('../repositories/offender');
const { analyticsRepository } = require('../repositories/analytics');
const { feedbackRepository } = require('../repositories/feedback');
const { CmsApi } = require('../repositories/cmsApi');
const PrisonApiRepository = require('../repositories/prisonApi');

// Services
const { CmsService } = require('./cms');
const { createOffenderService } = require('./offender');
const { createSearchService } = require('./search');
const { createAnalyticsService } = require('./analytics');
const { createFeedbackService } = require('./feedback');
const PrisonerInformationService = require('./prisonerInformation');

const cmsCachingStrategy = config?.features?.useRedisCache
  ? new RedisCachingStrategy()
  : new InMemoryCachingStrategy();
const jsonApiClient = new JsonApiClient(config.api.hubEndpoint);
const standardClient = new StandardClient();
const prisonApiClient = new PrisonApiClient({
  prisonApi: config.prisonApi,
  cachingStrategy: new InMemoryCachingStrategy(),
});
const incentivesApiClient = new IncentivesApiClient({
  incentivesApi: config.incentivesApi,
  cachingStrategy: new InMemoryCachingStrategy(),
});
const cmsApi = new CmsApi({
  jsonApiClient,
  cachingStrategy: cmsCachingStrategy,
});
const cmsService = new CmsService({
  cmsApi,
  cachingStrategy: cmsCachingStrategy,
});
const { searchRepository } = require('../repositories/search');

module.exports = {
  logger,
  cmsService,
  offenderService: createOffenderService(
    offenderRepository(prisonApiClient, incentivesApiClient),
  ),
  prisonerInformationService: new PrisonerInformationService({
    prisonApiRepository: new PrisonApiRepository({
      client: prisonApiClient,
      apiUrl: config.prisonApi.baseUrl,
    }),
  }),
  searchService: createSearchService({
    searchRepository: searchRepository(standardClient, logger),
  }),
  analyticsService: createAnalyticsService({
    analyticsRepository: analyticsRepository(standardClient),
  }),
  feedbackService: createFeedbackService({
    feedbackRepository: feedbackRepository(standardClient),
  }),
};
