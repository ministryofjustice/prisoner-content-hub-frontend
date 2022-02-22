/* eslint-disable import/order */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
const { initialiseAppInsights } = require('./utils/azureAppInsights');

initialiseAppInsights();

const services = require('./services');
const { createApp } = require('./app');

module.exports = createApp(services);
