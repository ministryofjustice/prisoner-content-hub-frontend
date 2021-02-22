const { path } = require('ramda');
const querystring = require('querystring');
const config = require('../config');

function validateOffenderNumberFor(offenderNo) {
  const pattern = new RegExp(/[A-Z][0-9]{4}[A-Z]{2}/i);
  return pattern.test(offenderNo);
}

const getBookingsUrlFrom = path(['prisonApi', 'endpoints', 'bookings']);
const getOffenderUrlFrom = path(['prisonApi', 'endpoints', 'offenders']);
const getBaseUrlFrom = path(['prisonApi', 'endpoints', 'base']);

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

  function getTransactionsFor(prisonerId, accountCode, fromDate, toDate) {
    const query = querystring.encode({
      account_code: accountCode,
      from_date: fromDate,
      to_date: toDate,
    });
    return httpClient.get(
      `${getOffenderUrlFrom(
        config,
      )}/${prisonerId}/transaction-history?${query}`,
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

  function getPrisonDetailsFor(prisonId) {
    return httpClient.get(`${getBaseUrlFrom(config)}/agencies/${[prisonId]}`);
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
    getTransactionsFor,
    getPrisonDetailsFor,
  };
}

module.exports = {
  offenderRepository,
};
