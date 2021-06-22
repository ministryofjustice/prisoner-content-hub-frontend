const querystring = require('querystring');
const config = require('../config');

function validateOffenderNumberFor(offenderNo) {
  const pattern = new RegExp(/[A-Z][0-9]{4}[A-Z]{2}/i);
  return pattern.test(offenderNo);
}

const baseUrl = `${config.prisonApi.baseUrl}/api`;

function offenderRepository(httpClient) {
  function getOffenderDetailsFor(offenderNo) {
    if (validateOffenderNumberFor(offenderNo)) {
      return httpClient.get(
        `${baseUrl}/bookings/offenderNo/${offenderNo.toUpperCase()}`,
      );
    }
    throw new Error('Invalid offender number');
  }

  function getIncentivesSummaryFor(bookingId) {
    return httpClient.get(`${baseUrl}/bookings/${bookingId}/iepSummary`);
  }

  function getBalancesFor(bookingId) {
    return httpClient.get(`${baseUrl}/bookings/${bookingId}/balances`);
  }

  function getKeyWorkerFor(offenderNo) {
    return httpClient.get(
      `${baseUrl}/bookings/offenderNo/${offenderNo}/key-worker`,
    );
  }

  function getNextVisitFor(bookingId, today) {
    const query = querystring.encode({
      fromDate: today,
      size: 1,
      page: 0,
      visitStatus: 'SCH',
    });
    return httpClient.get(
      `${baseUrl}/bookings/${bookingId}/visits-with-visitors?${query}`,
    );
  }

  function getVisitBalances(offenderNo) {
    return httpClient.get(
      `${baseUrl}/bookings/offenderNo/${offenderNo}/visit/balances`,
    );
  }

  function getVisitBalances(offenderNo) {
    return httpClient.get(
      `${baseUrl}/bookings/offenderNo/${offenderNo}/visit/balances`,
    );
  }

  function sentenceDetailsFor(bookingId) {
    return httpClient.get(`${baseUrl}/bookings/${bookingId}/sentenceDetail`);
  }

  function getCurrentEvents(bookingId) {
    return httpClient.get(`${baseUrl}/bookings/${bookingId}/events/today`);
  }

  function getEventsFor(bookingId, startDate, endDate) {
    const endpoint = `${baseUrl}/bookings/${bookingId}/events`;
    const query = [`fromDate=${startDate}`, `toDate=${endDate}`];

    return httpClient.get(`${endpoint}?${query.join('&')}`);
  }

  return {
    getOffenderDetailsFor,
    getIncentivesSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getNextVisitFor,
<<<<<<< HEAD
=======
    getLastVisitFor,
    getVisitsFor,
>>>>>>> 5b6c26c... feature/display-number-of-visits-remaining
    getVisitBalances,
    sentenceDetailsFor,
    getCurrentEvents,
    getEventsFor,
  };
}

module.exports = {
  offenderRepository,
};
