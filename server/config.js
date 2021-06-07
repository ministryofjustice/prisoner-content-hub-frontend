const { getEnv, isProduction } = require('../utils/index');

const hubEndpoint = getEnv('HUB_API_ENDPOINT', { requireInProduction: true });
const hmppsAuthBaseUrl = getEnv('HMPPS_AUTH_BASE_URL', 'https://api.nomis', {
  requireInProduction: true,
});
const elasticsearchEndpoint = getEnv(
  'ELASTICSEARCH_ENDPOINT',
  'http://localhost:9200',
  {
    requireInProduction: true,
  },
);
const elasticsearchIndexName = getEnv(
  'ELASTICSEARCH_INDEX_NAME',
  'content_index',
  {
    requireInProduction: true,
  },
);
const drupalDatabaseName = getEnv('DRUPAL_DATABASE_NAME', 'hubdb', {
  requireInProduction: true,
});

module.exports = {
  isProduction,
  buildInfo: {
    buildNumber: getEnv('BUILD_NUMBER', '9999999'),
    gitRef: getEnv('GIT_REF', 'abcd1234'),
    gitDate: getEnv('GIT_DATE', '2020-06-21 12:12:12'),
  },
  cookieSecret: getEnv('COOKIE_SECRET', 'keyboard cat'),
  auth: {
    clientId: getEnv('AZURE_AD_CLIENT_ID', { requireInProduction: true }),
    clientSecret: getEnv('AZURE_AD_CLIENT_SECRET', {
      requireInProduction: true,
    }),
    callbackPath: '/auth/provider/callback',
  },
  api: {
    hubEndpoint,
    hubContent: `${hubEndpoint}/v1/api/content`,
    hubCategoryFeatured: `${hubEndpoint}/v1/api/category/featured`,
    categoryMenu: `${hubEndpoint}/v1/api/category-menu`,
    hubTerm: `${hubEndpoint}/v1/api/term`,
    series: `${hubEndpoint}/v1/api/content/series`,
    tags: `${hubEndpoint}/v1/api/vocabulary/tags`,
  },
  apiV2: {
    hubContentFeatured: `${hubEndpoint}/v2/api/content/featured`,
  },
  caching: {
    secret: getEnv('CACHE_SECRET', { requireInProduction: true }),
    redis: {
      host: getEnv('REDIS_HOST', '127.0.0.1'),
      port: getEnv('REDIS_PORT', 6379),
      // password: getEnv('REDIS_PASSWORD', { requireInProduction: true }),
      tls: getEnv('REDIS_USE_TLS', 'false') === 'true' ? {} : false,
    },
  },
  prisonApi: {
    auth: {
      clientId: getEnv('HMPPS_AUTH_CLIENT_ID', 'UNSET'),
      clientSecret: getEnv('HMPPS_AUTH_CLIENT_SECRET', 'UNSET'),
      authUrl: `${hmppsAuthBaseUrl}/oauth/token?grant_type=client_credentials`,
    },
    baseUrl: getEnv('PRISON_API_BASE_URL', 'https://api.nomis', {
      requireInProduction: true,
    }),
  },
  elasticsearch: {
    search: `${elasticsearchEndpoint}/elasticsearch_index_${drupalDatabaseName}_${elasticsearchIndexName}/_search`,
  },
  features: {
    personalInformation:
      getEnv('ENABLE_PERSONAL_INFORMATION', 'false') === 'true',
    useRedisCache: getEnv('ENABLE_REDIS_CACHE', 'false') === 'true',
    useMockAuth: getEnv('ENABLE_MOCK_AUTH', 'false') === 'true',
    showStackTraces:
      getEnv('ENABLE_STACK_TRACES_ON_ERROR_PAGES', 'false') === 'true',
  },
  analytics: {
    endpoint: getEnv(
      'ANALYTICS_ENDPOINT',
      'https://www.google-analytics.com/collect',
    ),
    siteId: getEnv('ANALYTICS_SITE_ID', 'UA-152065860-4'),
  },
  feedback: {
    endpoint: getEnv(
      'FEEDBACK_URL',
      'http://localhost:9200/local-feedback/_doc',
      { requireInProduction: true },
    ),
  },
  npr: {
    stream: getEnv('NPR_STREAM', '/npr-stream'),
  },
};
