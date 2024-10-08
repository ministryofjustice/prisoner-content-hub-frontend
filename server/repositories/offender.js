const config = require('../config');

function validateOffenderNumberFor(offenderNo) {
  const pattern = /[A-Z][0-9]{4}[A-Z]{2}/i;
  return pattern.test(offenderNo);
}

const prisonApiBaseUrl = `${config.prisonApi.baseUrl}/api`;
const prisonContactRegistryBaseUrl = `${config.prisonerContactRegistryApi.baseUrl}`;
const incentivesApiBaseUrl = `${config.incentivesApi.baseUrl}`;

function offenderRepository(prisonApiHttpClient, incentivesApiHttpClient) {
  function getOffenderDetailsFor(offenderNo) {
    if (validateOffenderNumberFor(offenderNo)) {
      return prisonApiHttpClient.get(
        `${prisonApiBaseUrl}/bookings/offenderNo/${offenderNo.toUpperCase()}`,
      );
    }
    throw new Error('Invalid offender number');
  }

  function getIncentivesSummaryFor(bookingId) {
    return incentivesApiHttpClient.get(
      `${incentivesApiBaseUrl}/incentive-reviews/booking/${bookingId}`,
    );
  }

  function getBalancesFor(bookingId) {
    return prisonApiHttpClient.get(
      `${prisonApiBaseUrl}/bookings/${bookingId}/balances`,
    );
  }

  function getKeyWorkerFor(offenderNo) {
    return prisonApiHttpClient.get(
      `${prisonApiBaseUrl}/bookings/offenderNo/${offenderNo}/key-worker`,
    );
  }

  function getNextVisitFor(bookingId) {
    return prisonApiHttpClient.get(
      `${prisonApiBaseUrl}/bookings/${bookingId}/visits/next?withVisitors=true`,
    );
  }

  function getVisitorsFor(prisonerId) {
    return prisonApiHttpClient.get(
      `${prisonContactRegistryBaseUrl}/prisoners/${prisonerId}/contacts/social`,
    );
  }

  function getVisitBalances(offenderNo) {
    return prisonApiHttpClient.get(
      `${prisonApiBaseUrl}/bookings/offenderNo/${offenderNo}/visit/balances`,
    );
  }

  function sentenceDetailsFor(bookingId) {
    return prisonApiHttpClient.get(
      `${prisonApiBaseUrl}/bookings/${bookingId}/sentenceDetail`,
    );
  }

  function getCurrentEvents(bookingId) {
    return prisonApiHttpClient.get(
      `${prisonApiBaseUrl}/bookings/${bookingId}/events/today`,
    );
  }

  function getEventsFor(bookingId, startDate, endDate) {
    const endpoint = `${prisonApiBaseUrl}/bookings/${bookingId}/events`;
    const query = [`fromDate=${startDate}`, `toDate=${endDate}`];

    return prisonApiHttpClient.get(`${endpoint}?${query.join('&')}`);
  }

  function getAdjudicationsFor(offenderNo) {
    return prisonApiHttpClient.get(
      `${prisonApiBaseUrl}/offenders/${offenderNo}/adjudications`,
      {
        'Page-Limit': config.prisonApi.adjudications.pageLimit,
      },
    );
  }

  function getAdjudicationFor(offenderNo, adjudicationNo) {
    return prisonApiHttpClient.get(
      `${prisonApiBaseUrl}/offenders/${offenderNo}/adjudications/${adjudicationNo}`,
    );
  }

  return {
    getOffenderDetailsFor,
    getIncentivesSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getNextVisitFor,
    getVisitorsFor,
    getVisitBalances,
    sentenceDetailsFor,
    getCurrentEvents,
    getEventsFor,
    getAdjudicationsFor,
    getAdjudicationFor,
  };
}

module.exports = {
  offenderRepository,
};
