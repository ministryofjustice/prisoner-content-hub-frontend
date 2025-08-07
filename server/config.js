const { getEnv, getRequiredEnv, isProduction } = require('../utils/index');

const hubEndpoint = getRequiredEnv(
  'HUB_API_ENDPOINT',
  'http://localhost:11001',
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
  api: {
    hubEndpoint,
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
  features: {
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
      languages: ['en'],
    },
    bullingdon: {
      languages: ['en'],
    },
    cardiff: {
      languages: ['en', 'cy'],
    },
    chelmsford: {
      languages: ['en'],
    },
    cookhamwood: {
      languages: ['en'],
    },
    erlestoke: {
      languages: ['en'],
    },
    etwoe: {
      languages: ['en'],
    },
    felthama: {
      languages: ['en'],
    },
    felthamb: {
      languages: ['en'],
    },
    garth: {
      languages: ['en'],
    },
    lindholme: {
      languages: ['en'],
    },
    newhall: {
      languages: ['en'],
    },
    ranby: {
      languages: ['en'],
    },
    stokeheath: {
      languages: ['en'],
    },
    styal: {
      languages: ['en'],
    },
    swaleside: {
      languages: ['en'],
    },
    themount: {
      languages: ['en'],
    },
    thestudio: {
      languages: ['en', 'cy'],
    },
    wayland: {
      languages: ['en'],
    },
    werrington: {
      languages: ['en'],
    },
    wetherby: {
      languages: ['en'],
    },
    woodhill: {
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
    host: getRequiredEnv('FEEDBACK_DATABASE_URL', 'localhost'),
    user: getRequiredEnv('FEEDBACK_DATABASE_USERNAME', 'feedbackuser'),
    password: getRequiredEnv('FEEDBACK_DATABASE_PASSWORD', 'feedbackpassword'),
    database: getRequiredEnv('FEEDBACK_DATABASE_NAME', 'feedbackdatabase'),
  },
  npr: {
    stream: getEnv('NPR_STREAM', '/npr-stream'),
  },
};
