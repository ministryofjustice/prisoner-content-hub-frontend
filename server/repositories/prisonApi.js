const { path } = require('ramda');
const querystring = require('querystring');
const { formatISO } = require('date-fns');
const { logger } = require('../utils/logger');
const defaultConfiguration = require('../config');

class PrisonApiRepository {
  constructor({ client, config = defaultConfiguration }) {
    this.client = client;
    this.config = config;
  }

  // We could eventually shunt this up in to the PrisonAPI client as the default base URL
  getBaseUrl() {
    return path(['prisonApi', 'endpoints', 'base'], this.config);
  }

  async getTransactionsFor(prisonerId, accountCode, fromDate, toDate) {
    if (!prisonerId || !accountCode || !fromDate || !toDate) {
      throw new Error('Incorrect parameters passed');
    }

    try {
      const query = querystring.encode({
        account_code: accountCode,
        from_date: formatISO(fromDate, { representation: 'date' }),
        to_date: formatISO(toDate, { representation: 'date' }),
      });

      logger.info(
        `PrisonApiRepository (getTransactionsFor) - User: ${prisonerId}`,
      );

      const response = await this.client.get(
        `${this.getBaseUrl()}/offenders/${prisonerId}/transaction-history?${query}`,
      );

      return response;
    } catch (e) {
      logger.error(
        `PrisonApiRepository (getTransactionsFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }
}

module.exports = {
  PrisonApiRepository,
};
