const { path } = require('ramda');
const config = require('../config');

function validateOffenderNumberFor(offenderNo) {
  const pattern = new RegExp(/[A-Z][0-9]{4}[A-Z]{2}/i);
  return pattern.test(offenderNo);
}

const getBookingsUrlFrom = path(['prisonApi', 'endpoints', 'bookings']);

function offenderRepository(httpClient) {
  function getOffenderDetailsFor(offenderNo) {
    if (validateOffenderNumberFor(offenderNo)) {
      return httpClient.get(
        `${getBookingsUrlFrom(config)}/offenderNo/${offenderNo.toUpperCase()}`,
      );
    }
    throw new Error('Invalid offender number');
  }

  function getIncentivesSummaryFor(bookingId) {
    return httpClient.get(
      `${getBookingsUrlFrom(config)}/${bookingId}/iepSummary`,
    );
  }

  function getBalancesFor(bookingId) {
    return httpClient.get(
      `${getBookingsUrlFrom(config)}/${bookingId}/balances`,
    );
  }

  function getKeyWorkerFor(offenderNo) {
    return httpClient.get(
      `${getBookingsUrlFrom(config)}/offenderNo/${offenderNo}/key-worker`,
    );
  }

  function getNextVisitFor(bookingId) {
    return httpClient.get(
      `${getBookingsUrlFrom(config)}/${bookingId}/visits/next`,
    );
  }

  function getLastVisitFor(bookingId) {
    return httpClient.get(
      `${getBookingsUrlFrom(config)}/${bookingId}/visits/last`,
    );
  }

  function getVisitsFor(bookingId, startDate) {
    const endpoint = `${getBookingsUrlFrom(config)}/${bookingId}/visits`;
    const query = [`fromDate=${startDate}`, `toDate=${startDate}`];

    return httpClient.get(`${endpoint}?${query.join('&')}`);
  }

  function sentenceDetailsFor(bookingId) {
    return httpClient.get(
      `${getBookingsUrlFrom(config)}/${bookingId}/sentenceDetail`,
    );
  }

  function getEventsForToday(bookingId) {
    return httpClient.get(
      `${getBookingsUrlFrom(config)}/${bookingId}/events/today`,
    );
  }

  function getEventsFor(bookingId, startDate, endDate) {
    const endpoint = `${getBookingsUrlFrom(config)}/${bookingId}/events`;
    const query = [`fromDate=${startDate}`, `toDate=${endDate}`];

    return httpClient.get(`${endpoint}?${query.join('&')}`);
  }

  return {
    getOffenderDetailsFor,
    getIncentivesSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getNextVisitFor,
    getLastVisitFor,
    getVisitsFor,
    sentenceDetailsFor,
    getEventsForToday,
    getEventsFor,
  };
}

module.exports = {
  offenderRepository,
};
