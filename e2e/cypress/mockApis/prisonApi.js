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

const stubBalancesFor = incentives =>
  stub(`/prisonapi/api/bookings/.*?/balances`, incentives);

const stubVisitors = visitors =>
  stub(`/prisonapi/api/bookings/.*?/contacts`, visitors);

const stubVisit = visit =>
  stub(`/prisonapi/api/bookings/.*?/visits/next\\?withVisitors=true`, visit);

const stubVisitsRemaining = visitsRemaining =>
  stub(
    `/prisonapi/api/bookings/offenderNo/.*?/visit/balances`,
    visitsRemaining,
  );

module.exports = {
  stubOffenderDetails,
  stubEvents,
  stubBalancesFor,
  stubVisitors,
  stubVisit,
  stubVisitsRemaining,
};
