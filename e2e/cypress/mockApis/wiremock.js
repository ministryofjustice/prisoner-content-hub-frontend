const superagent = require('superagent');

const host = process.env.WIREMOCK_BASE_URL || 'http://localhost:9091';
const url = `${host}/__admin`;

console.log(`wiremock url: ${url}`);

const stubFor = mapping => superagent.post(`${url}/mappings`).send(mapping);

const resetStubs = () =>
  Promise.all([
    superagent.delete(`${url}/mappings`),
    superagent.delete(`${url}/requests`),
  ]);

module.exports = {
  stubFor,
  resetStubs,
};
