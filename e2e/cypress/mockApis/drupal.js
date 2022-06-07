const jwt = require('jsonwebtoken');
const { stubFor } = require('./wiremock');
const primaryNavigationData = require('./drupalData/primaryNavigation.json');
const browseAllTopicsData = require('./drupalData/browseAllTopics.json');

const stubPrimaryNavigation = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/drupal/jsonapi/prison/.*?/primary_navigation.*?',
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
      urlPattern: '/drupal/jsonapi/prison/.*?/taxonomy_term.*?',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: browseAllTopicsData,
    },
  });

module.exports = {
  stubPrimaryNavigation,
  stubBrowseAllTopics,
};
