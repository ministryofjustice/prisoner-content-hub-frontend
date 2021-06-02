const { stubFor } = require('./wiremock');

const stubOffenderDetails = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisonapi/api/bookings/offenderNo/.+`,
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

module.exports = {
  stubOffenderDetails,
  stubEvents,
};
