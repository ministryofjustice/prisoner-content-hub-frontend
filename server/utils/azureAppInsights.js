const { config } = require('dotenv');
const appInsights = require('applicationinsights');
const applicationVersion = require('./applicationVersion');

const { setup, DistributedTracingModes, Contracts } = appInsights;

const defaultName = () => applicationVersion?.packageData?.name;
const version = () => applicationVersion.buildNumber;

const prefixesToIgnore = ['GET /public/', 'GET /assets/', 'GET /health'];

function ignoreStaticAssetsProcessor(envelope) {
  if (envelope.data.baseType === Contracts.TelemetryTypeString.Request) {
    const requestData = envelope.data.baseData;
    if (requestData instanceof Contracts.RequestData) {
      const { name } = requestData;
      return prefixesToIgnore.every(prefix => !name.startsWith(prefix));
    }
  }
  return true;
}

function addEstablishmentProcessor(envelope, contextObjects) {
  if (envelope.data.baseType === Contracts.TelemetryTypeString.Request) {
    const establishmentName =
      contextObjects?.['http.ServerRequest']?.session?.establishmentName;
    if (establishmentName) {
      const { properties } = envelope.data.baseData;
      // eslint-disable-next-line no-param-reassign
      envelope.data.baseData.properties = { establishmentName, ...properties };
    }
  }
  return true;
}

function initialiseAppInsights() {
  // Loads .env file contents into | process.env
  config();
  if (!process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    return null;
  }
  // eslint-disable-next-line no-console
  console.log('Enabling azure application insights');

  setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start();

  const client = appInsights.defaultClient;
  client.context.tags['ai.cloud.role'] = defaultName();
  client.context.tags['ai.application.ver'] = version();
  client.addTelemetryProcessor(addEstablishmentProcessor);
  client.addTelemetryProcessor(ignoreStaticAssetsProcessor);
  return client;
}

module.exports = {
  ignoreStaticAssetsProcessor,
  addEstablishmentProcessor,
  initialiseAppInsights,
};
