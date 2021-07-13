const { stubFor } = require('./wiremock');

const stubOffenderDetails = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisonapi/api/bookings/offenderNo/[^/]+$`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        bookingId: 14,
        firstName: 'John',
        lastName: 'Smith',
        agencyId: 'MDI',
      },
    },
  });
};

const stubEvents = events => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisonapi/api/bookings/.*?/events\\?fromDate=.*?&toDate=.*?`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: events,
    },
  });
};

const stubVisits = visits => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisonapi/api/bookings/.*?/visits-with-visitors\\?.*?`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: visits,
    },
  });
};

const stubVisitsRemaining = visitsRemaining => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisonapi/api/bookings/offenderNo/.*?/visit/balances`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: visitsRemaining,
    },
  });
};

module.exports = {
  stubOffenderDetails,
  stubEvents,
  stubVisits,
  stubVisitsRemaining,
};
