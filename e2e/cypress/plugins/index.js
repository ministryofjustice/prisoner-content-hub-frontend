const auth = require('../mockApis/auth');
const incentivesApi = require('../mockApis/incentivesApi');
const drupal = require('../mockApis/drupal');
const { resetStubs } = require('../mockApis/wiremock');

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    ...auth,
    ...incentivesApi,
    ...drupal,
    stubPrisonerSignIn: () => Promise.all([auth.stubClientCredentialsToken()]),
    reset: () => resetStubs(),
  });
};
