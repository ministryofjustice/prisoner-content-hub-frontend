const querystring = require('querystring');
const { formatISO } = require('date-fns');
const { logger } = require('../utils/logger');
const { getEnv } = require('../../utils');

class PrisonApiRepository {
  constructor({ client, apiUrl }) {
    this.client = client;
    this.url =
      apiUrl ||
      getEnv('PRISON_API_BASE_URL', 'https://api.nomis', {
        requireInProduction: true,
      });
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
        `${this.url}/api/offenders/${prisonerId}/transaction-history?${query}`,
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

  async getPrisonDetailsFor(prisonId) {
    if (!prisonId) {
      throw new Error('Incorrect parameters passed');
    }

    try {
      logger.info(
        `PrisonApiRepository (getPrisonDetailsFor) - Prison ID: ${prisonId}`,
      );

      const response = await this.client.get(
        `${this.url}/api/agencies/${[prisonId]}`,
      );

      return response;
    } catch (e) {
      logger.error(
        `PrisonApiRepository (getPrisonDetailsFor) - Failed: ${e.message} - Prison ID: ${prisonId}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }

  async getBalancesFor(bookingId) {
    if (!bookingId) {
      throw new Error('Incorrect parameters passed');
    }

    try {
      const response = await this.client.get(
        `${this.url}/api/bookings/${bookingId}/balances`,
      );

      return response;
    } catch (e) {
      logger.error(
        `PrisonApiRepository (getBalancesFor) - Failed: ${e.message} - Booking ID: ${bookingId}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }
}

module.exports = {
  PrisonApiRepository,
};
