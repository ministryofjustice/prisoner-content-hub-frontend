const { stubFor } = require('./wiremock');

const stub = (urlPattern, jsonBody) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody,
    },
  });

const stubIncentives = incentives =>
  stub(`/incentivesapi/incentive-reviews/booking/.*?`, incentives);

module.exports = {
  stubIncentives,
};
