const superagent = require('superagent');

const url = 'http://localhost:9091/__admin';

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
