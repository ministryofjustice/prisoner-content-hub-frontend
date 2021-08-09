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

const stubOffenderDetails = () =>
  stub(`/prisonapi/api/bookings/offenderNo/[^/]+$`, {
    bookingId: 14,
    firstName: 'John',
    lastName: 'Smith',
    agencyId: 'MDI',
  });

const stubEvents = events =>
  stub(`/prisonapi/api/bookings/.*?/events\\?fromDate=.*?&toDate=.*?`, events);

const stubIncentives = incentives =>
  stub(`/prisonapi/api/bookings/.*?/iepSummary`, incentives);

const stubBalancesFor = incentives =>
  stub(`/prisonapi/api/bookings/.*?/balances`, incentives);

const stubVisits = visits =>
  stub(`/prisonapi/api/bookings/.*?/visits-with-visitors\\?.*?`, visits);

const stubVisitsRemaining = visitsRemaining =>
  stub(
    `/prisonapi/api/bookings/offenderNo/.*?/visit/balances`,
    visitsRemaining,
  );

module.exports = {
  stubOffenderDetails,
  stubEvents,
  stubIncentives,
  stubBalancesFor,
  stubVisits,
  stubVisitsRemaining,
};
