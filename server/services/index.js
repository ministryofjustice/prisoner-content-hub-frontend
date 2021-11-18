const redis = require('redis');
const { path } = require('ramda');
const { logger, requestLogger } = require('../utils/logger');
const config = require('../config');

const { HubClient } = require('../clients/hub');
const { StandardClient } = require('../clients/standard');
const { PrisonApiClient } = require('../clients/prisonApiClient');
const { JsonApiClient } = require('../clients/jsonApiClient');

const {
  RedisCachingStrategy,
  InMemoryCachingStrategy,
} = require('../utils/caching');

// Repositories
const { contentRepository } = require('../repositories/hubContent');
const { offenderRepository } = require('../repositories/offender');
const { analyticsRepository } = require('../repositories/analytics');
const { feedbackRepository } = require('../repositories/feedback');
const { CmsApi } = require('../repositories/cmsApi');
const PrisonApiRepository = require('../repositories/prisonApi');

// Services
const { CmsService } = require('./cms');
const { createHubTagsService } = require('./hubTags');
const { createPrisonApiOffenderService } = require('./offender');
const { createSearchService } = require('./search');
const { createAnalyticsService } = require('./analytics');
const { createFeedbackService } = require('./feedback');
const PrisonerInformationService = require('./prisonerInformation');

const cachingStrategy = path(['features', 'useRedisCache'], config)
  ? new RedisCachingStrategy(
      config.caching.secret,
      redis.createClient(config.caching.redis),
    )
  : new InMemoryCachingStrategy();

const hubClient = new HubClient();
const jsonApiClient = new JsonApiClient(config.api.hubEndpoint);
const standardClient = new StandardClient();
const prisonApiClient = new PrisonApiClient({
  prisonApi: config.prisonApi,
  cachingStrategy,
});

const cmsApi = new CmsApi(jsonApiClient);
const cmsService = new CmsService(cmsApi);

module.exports = {
  logger,
  requestLogger,
  cmsService,
  hubTagsService: createHubTagsService(
    contentRepository(hubClient),
    cmsService,
  ),
  offenderService: createPrisonApiOffenderService(
    offenderRepository(prisonApiClient),
  ),
  prisonerInformationService: new PrisonerInformationService({
    prisonApiRepository: new PrisonApiRepository({
      client: prisonApiClient,
      apiUrl: config.prisonApi.baseUrl,
    }),
  }),
  searchService: createSearchService({ cmsApi }),
  analyticsService: createAnalyticsService({
    analyticsRepository: analyticsRepository(standardClient),
  }),
  feedbackService: createFeedbackService({
    feedbackRepository: feedbackRepository(standardClient),
  }),
};
