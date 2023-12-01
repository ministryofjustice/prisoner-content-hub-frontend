const { getEnv, getRequiredEnv, isProduction } = require('../utils/index');

const hubEndpoint = getRequiredEnv('HUB_API_ENDPOINT', 'http://localhost:9090');
const hmppsAuthBaseUrl = getRequiredEnv(
  'HMPPS_AUTH_BASE_URL',
  'https://api.nomis',
);
const elasticsearchEndpoint = getRequiredEnv(
  'ELASTICSEARCH_ENDPOINT',
  'http://localhost:9200',
);
const feedbackEndpoint = getRequiredEnv(
  'FEEDBACK_ENDPOINT',
  '/local-feedback/_doc',
);

module.exports = {
  isProduction,
  logLevel: getEnv('LOG_LEVEL', 'info'),
  buildInfo: {
    buildNumber: getEnv('BUILD_NUMBER', '9999999'),
    gitRef: getEnv('GIT_REF', 'abcd1234'),
    gitDate: getEnv('GIT_DATE', '2020-06-21 12:12:12'),
  },
  cookieSecret: getEnv('COOKIE_SECRET', 'keyboard cat'),
  singleHostName: getRequiredEnv('SINGLE_HOST_NAME', 'localhost'),
  auth: {
    clientId: getRequiredEnv('AZURE_AD_CLIENT_ID', 'client-1'),
    clientSecret: getRequiredEnv('AZURE_AD_CLIENT_SECRET', 'secret-1'),
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
  caching: {
    secret: getRequiredEnv('CACHE_SECRET', 'secret-2'),
  },
  redis: {
    host: getRequiredEnv('REDIS_HOST', 'localhost'),
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: getEnv('REDIS_TLS_ENABLED', 'false'),
  },
  prisonApi: {
    auth: {
      clientId: getEnv('HMPPS_AUTH_CLIENT_ID', 'UNSET'),
      clientSecret: getEnv('HMPPS_AUTH_CLIENT_SECRET', 'UNSET'),
      authUrl: `${hmppsAuthBaseUrl}/oauth/token?grant_type=client_credentials`,
    },
    baseUrl: getRequiredEnv('PRISON_API_BASE_URL', 'https://api.nomis'),
    adjudications: {
      pageLimit: 50,
      maxAdjudicationsPerPage: 10,
    },
  },
  prisonerContactRegistryApi: {
    auth: {
      clientId: getEnv('HMPPS_AUTH_CLIENT_ID', 'UNSET'),
      clientSecret: getEnv('HMPPS_AUTH_CLIENT_SECRET', 'UNSET'),
      authUrl: `${hmppsAuthBaseUrl}/oauth/token?grant_type=client_credentials`,
    },
    baseUrl: getRequiredEnv(
      'PRISONER_CONTACT_REGISTRY_BASE_URL',
      'http://localhost:8080',
    ),
  },
  incentivesApi: {
    auth: {
      clientId: getEnv('HMPPS_AUTH_CLIENT_ID', 'UNSET'),
      clientSecret: getEnv('HMPPS_AUTH_CLIENT_SECRET', 'UNSET'),
      authUrl: `${hmppsAuthBaseUrl}/oauth/token?grant_type=client_credentials`,
    },
    baseUrl: getRequiredEnv('INCENTIVES_API_BASE_URL', 'https://api.nomis'),
  },
  adjudicationsApi: {
    auth: {
      clientId: getEnv('HMPPS_AUTH_CLIENT_ID', 'UNSET'),
      clientSecret: getEnv('HMPPS_AUTH_CLIENT_SECRET', 'UNSET'),
      authUrl: `${hmppsAuthBaseUrl}/oauth/token?grant_type=client_credentials`,
    },
    baseUrl: getRequiredEnv('ADJUDICATIONS_API_BASE_URL', 'https://api.nomis'),
    adjudications: {
      pageLimit: 50,
      maxAdjudicationsPerPage: 10,
    },
  },
  features: {
    useMockAuth: getEnv('ENABLE_MOCK_AUTH', 'false') === 'true',
    showStackTraces:
      getEnv('ENABLE_STACK_TRACES_ON_ERROR_PAGES', 'false') === 'true',
    useRedisCache: getEnv('ENABLE_REDIS_CACHE', 'true') === 'true',
    approvedVisitorsFeatureEnabled:
      getEnv('APPROVED_VISITORS_FEATURE_ENABLED', 'false') === 'true',
    adjudicationsFeatureEnabled:
      getEnv('ADJUDICATIONS_FEATURE_ENABLED', 'false') === 'true',
    adjudicationsFeatureEnabledAt: [
      'cookhamwood',
      'erlestoke',
      'felthama',
      'felthamb',
      'garth',
      'lindholme',
      'newhall',
      'ranby',
      'stokeheath',
      'styal',
      'swaleside',
      'themount',
      'wayland',
      'werrington',
      'wetherby',
    ],
  },
  analytics: {
    endpoint: getEnv(
      'ANALYTICS_ENDPOINT',
      'https://www.google-analytics.com/collect',
    ),
    siteId: getEnv('ANALYTICS_SITE_ID', 'G-0RBPFCWD3X'),
    gtmSiteId: getEnv('GOOGLE_TAG_MANAGER_SITE_ID', 'GTM-M62TTBK'),
  },
  feedback: {
    endpoint: elasticsearchEndpoint + feedbackEndpoint,
  },
  npr: {
    stream: getEnv('NPR_STREAM', '/npr-stream'),
  },
};
