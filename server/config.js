const { getEnv, getRequiredEnv, isProduction } = require('../utils/index');

const hubEndpoint = getRequiredEnv(
  'HUB_API_ENDPOINT',
  'http://localhost:11001',
);
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

// covers all features being enabled to stop repetition as requested, commented out to stop errors in linting while no sites are using everything
// const ALL_PROFILE_FEATURES = [
//   'adjudications',
//   'approvedVisitors',
//   'incentives',
//   'money',
//   'timetable',
//   'visits',
// ];

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
  },
  defaultLanguage: 'en',
  languages: [
    { lang: 'en', text: 'English' },
    { lang: 'cy', text: 'Cymraeg' },
  ],
  sites: {
    berwyn: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    bullingdon: {
      enabled: true,
      features: ['incentives', 'money', 'timetable', 'visits'],
      languages: ['en'],
    },
    cardiff: {
      enabled: true,
      features: ['adjudications', 'incentives', 'money', 'timetable', 'visits'],
      languages: ['en'],
    },
    chelmsford: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    cookhamwood: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    erlestoke: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    etwoe: {
      enabled: true,
      features: ['adjudications', 'incentives', 'money', 'timetable', 'visits'],
    },
    felthama: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    felthamb: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    garth: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    lindholme: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    newhall: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    ranby: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    stokeheath: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    styal: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    swaleside: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    themount: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    thestudio: {
      enabled: false,
      features: [],
      languages: ['en', 'cy'],
    },
    wayland: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    werrington: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    wetherby: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
    woodhill: {
      enabled: false,
      features: [],
      languages: ['en'],
    },
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
