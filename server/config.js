const { getEnv, isProduction, isTest } = require('../utils/index');

const berwynGAJMenu = require('./data/berwyn-step-by-step.json');
const waylandGAJMenu = require('./data/wayland-step-by-step.json');

const hubEndpoint = getEnv('HUB_API_ENDPOINT', { requireInProduction: true });
const backendUrl = getEnv('BACKEND_URL', 'http://hub-be:80');
const nomisEndpoint = getEnv('NOMIS_API_ENDPOINT', 'https://api.nomis', {
  requireInProduction: true,
});
const elasticSearchEndpoint = getEnv(
  'ELASTICSEARCH_ENDPOINT',
  'http://localhost:9200',
  {
    requireInProduction: true,
  },
);
const establishments = {
  792: {
    name: 'berwyn',
    formattedName: 'Berwyn',
    prefix: 'HMP',
    uuId: 'fd1e1db7-d0be-424a-a3a6-3b0f49e33293',
    standFirst: 'What you need to do to get or change your job in Berwyn.',
    workingIn: berwynGAJMenu,
    homePageLinksTitle: 'Popular topics',
    homePageLinks: {
      Coronavirus: '/tags/894',
      Visits: '/content/4203',
      Games: '/content/3621',
      Inspiration: '/content/3659',
      'Music & talk': '/content/3662',
      'PSIs & PSOs': '/tags/796',
      'Facilities list & catalogues': '/content/3990',
      'Healthy mind & body': '/content/3657',
      Chaplaincy: '/tags/901',
    },
  },
  793: {
    name: 'wayland',
    formattedName: 'Wayland',
    prefix: 'HMP',
    uuId: 'b73767ea-2cbb-4ad5-ba22-09379cc07241',
    standFirst: 'How to do to get, or change, a job in this prison.',
    workingIn: waylandGAJMenu,
    homePageLinksTitle: 'Popular topics',
    homePageLinks: {
      Coronavirus: '/tags/894',
      Visits: '/content/4203',
      Games: '/content/3621',
      Inspiration: '/content/3659',
      'Music & talk': '/content/3662',
      'PSIs & PSOs': '/tags/796',
      'Facilities list & catalogues': '/content/4539',
      'Healthy mind & body': '/content/3657',
      Chaplaincy: '/tags/901',
    },
  },
  959: {
    name: 'cookhamwood',
    formattedName: 'Cookham Wood',
    prefix: 'HMYOI',
    uuId: '9969cd5a-90fa-476c-9f14-3f85b26d23bc',
    workingIn: [],
    homePageLinksTitle: 'Popular topics',
    homePageLinks: {
      Coronavirus: '/tags/894',
      Visits: '/content/4203',
      Games: '/content/3621',
      Inspiration: '/content/3659',
      'Music & talk': '/content/3662',
      'PSIs & PSOs': '/tags/796',
      'Facilities list & catalogues': '/content/1234',
      'Healthy mind & body': '/content/3657',
      Chaplaincy: '/tags/901',
    },
  },
};

module.exports = {
  appName: getEnv('APP_NAME', 'prisoner-content-hub-frontend', {
    requireInProduction: true,
  }),
  dev: !isProduction && !isTest,
  test: isTest,
  production: isProduction,
  useRelativeUrl: getEnv('FEATURE_USE_RELATIVE_URL', 'true') === 'true',
  backendUrl,
  buildInfo: {
    buildNumber: getEnv('BUILD_NUMBER', '9999999'),
    gitRef: getEnv('GIT_REF', 'abcd1234'),
    gitDate: getEnv('GIT_DATE', '2020-06-21 12:12:12'),
  },
  cookieSecret: getEnv('COOKIE_SECRET', 'keyboard cat'),
  establishments,
  establishmentName: getEnv('ESTABLISHMENT_NAME', 'berwyn', {
    requireInProduction: true,
  }),
  hubEndpoint,
  ldap: {
    url: getEnv('LDAP_URL', 'keyboard cat'),
    adminDn: getEnv('LDAP_ADMIN_DN', 'keyboard cat'),
    adminPassword: getEnv('LDAP_ADMIN_PWD', 'keyboard cat'),
    userSearchBase: getEnv('LDAP_USER_SEARCH_BASE', 'keyboard cat'),
    starttls: getEnv('LDAP_START_TLS', 'true') === 'true',
    certPath: getEnv('LDAP_CERT_PATH', '/etc/ssl/ca-certificates.crt'),
    usernameAttribute: getEnv('LDAP_USERNAME_ATTRIBUTE', 'cn'),
  },
  api: {
    hubHealth: `${hubEndpoint}/api/health`,
    hubContent: `${hubEndpoint}/v1/api/content`,
    hubCategory: `${hubEndpoint}/v1/api/category`,
    hubMenu: `${hubEndpoint}/v1/api/menu`,
    categoryMenu: `${hubEndpoint}/v1/api/category-menu`,
    hubTerm: `${hubEndpoint}/v1/api/term`,
    series: `${hubEndpoint}/v1/api/content/series`,
    tags: `${hubEndpoint}/v1/api/vocabulary/tags`,
    primary: `${hubEndpoint}/jsonapi/node/landing_page?fields[node--landing_page]=title,field_moj_description,drupal_internal__nid,field_moj_prisons`,
    search: `${hubEndpoint}/jsonapi/index/content_index`,
  },
  apiV2: {
    hubContent: `${hubEndpoint}/v2/api/content`,
  },
  phone: {
    server: getEnv('PHONE_SERVER', { requireInProduction: true }),
    port: parseInt(getEnv('PHONE_PORT', { requireInProduction: true }), 10),
    passPhrase: getEnv('PHONE_PASSPHRASE', { requireInProduction: true }),
    iterations: parseInt(
      getEnv('PHONE_ITERATIONS', { requireInProduction: true }),
      10,
    ),
    salt: getEnv('PHONE_SALT', { requireInProduction: true }),
    initialisationVector: getEnv('PHONE_IV', { requireInProduction: true }),
  },
  nomis: {
    clientToken: getEnv('NOMIS_API_TOKEN', 'ADD_ME'),
    api: {
      auth: `${nomisEndpoint}/auth/oauth/token?grant_type=client_credentials`,
      bookings: `${nomisEndpoint}/elite2api/api/bookings`,
    },
  },
  elasticsearch: {
    health: `${elasticSearchEndpoint}/_cluster/health?pretty`,
    search: `${elasticSearchEndpoint}/elasticsearch_index_hubdb_content_index/_search`,
  },
  features: {
    newDesigns: getEnv('FEATURE_NEW_DESIGNS', 'false') === 'true',
    prisonSwitch: getEnv('ENABLE_PRISON_SWITCH', 'false') === 'true',
  },
  mockAuth: getEnv('MOCK_AUTH', 'false') === 'true',
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
