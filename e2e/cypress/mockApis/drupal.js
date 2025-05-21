const { stubFor } = require('./wiremock');
const primaryNavigationData = require('./drupalData/primaryNavigation.json');
const browseAllTopicsData = require('./drupalData/browseAllTopics.json');
const urgentBannersData = require('./drupalData/urgentBanners.json');

const stubPrimaryNavigation = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/drupal/en/jsonapi/prison/.*?/primary_navigation.*?',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: primaryNavigationData,
    },
  });

const stubBrowseAllTopics = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/drupal/en/jsonapi/prison/.*?/taxonomy_term.*?',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: browseAllTopicsData,
    },
  });

const stubUrgentBanners = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/drupal/en/jsonapi/prison/.*?/node/urgent_banner.*?',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: urgentBannersData,
    },
  });

module.exports = {
  stubPrimaryNavigation,
  stubBrowseAllTopics,
  stubUrgentBanners,
};
