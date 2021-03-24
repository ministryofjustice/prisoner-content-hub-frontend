const querystring = require('querystring');
const assert = require('assert');
const { formatISO } = require('date-fns');
const Sentry = require('@sentry/node');

const { logger } = require('../utils/logger');
const {
  isValidPrisonerId,
  isValidAccountCode,
  isValidDate,
  isValidBookingId,
  isValidTransactionType,
} = require('../utils/validators');
const { getEnvironmentVariableOrThrow } = require('../../utils');

class PrisonApiRepository {
  constructor({ client, apiUrl }) {
    this.client = client;
    this.url = apiUrl || getEnvironmentVariableOrThrow('PRISON_API_BASE_URL');
  }

  async getTransactionsForDateRange(
    prisonerId,
    { accountCode, fromDate, toDate } = {},
  ) {
    assert(
      isValidPrisonerId(prisonerId),
      `Prisoner ID must be a string in the format "A1234BC" - Received: ${prisonerId}`,
    );
    assert(
      isValidAccountCode(accountCode),
      `Invalid account code - Received: ${accountCode}`,
    );
    assert(isValidDate(fromDate), 'From date must be a valid Date object');
    assert(isValidDate(toDate), 'To date must be a valid Date object');

    try {
      const query = querystring.encode({
        account_code: accountCode,
        from_date: formatISO(fromDate, { representation: 'date' }),
        to_date: formatISO(toDate, { representation: 'date' }),
      });

      logger.info(
        `PrisonApiRepository (getTransactionsForDateRange) - User: ${prisonerId}`,
      );

      const response = await this.client.get(
        `${this.url}/api/offenders/${prisonerId}/transaction-history?${query}`,
      );

      return response;
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        `PrisonApiRepository (getTransactionsForDateRange) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }

  async getTransactionsByType(
    prisonerId,
    { accountCode, transactionType } = {},
  ) {
    assert(
      isValidPrisonerId(prisonerId),
      `Prisoner ID must be a string in the format "A1234BC" - Received: ${prisonerId}`,
    );
    assert(
      isValidAccountCode(accountCode),
      `Invalid account code - Received: ${accountCode}`,
    );
    assert(
      isValidTransactionType(transactionType),
      `Invalid transaction type - Received: ${transactionType}`,
    );

    try {
      const query = querystring.encode({
        account_code: accountCode,
        transaction_type: transactionType,
      });

      logger.info(
        `PrisonApiRepository (getTransactionsByType) - User: ${prisonerId}`,
      );

      const response = await this.client.get(
        `${this.url}/api/offenders/${prisonerId}/transaction-history?${query}`,
      );

      return response;
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        `PrisonApiRepository (getTransactionsByType) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }

  async getPrisonDetails() {
    try {
      logger.info('PrisonApiRepository (getPrisonDetailsFor)');

      const response = await this.client.get(`${this.url}/api/agencies/prison`);

      return response;
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        `PrisonApiRepository (getPrisonDetailsFor) - Failed: ${e.message}`,
      );
      logger.debug(e.stack);
      return [];
    }
  }

  async getBalancesFor(bookingId) {
    assert(
      isValidBookingId(bookingId),
      `Booking ID must be a number - Received: ${bookingId}`,
    );

    try {
      const response = await this.client.get(
        `${this.url}/api/bookings/${bookingId}/balances`,
      );

      return response;
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        `PrisonApiRepository (getBalancesFor) - Failed: ${e.message} - Booking ID: ${bookingId}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }

  async getDamageObligationsFor(prisonerId) {
    assert(
      isValidPrisonerId(prisonerId),
      `Prisoner ID must be a string in the format "A1234BC" - Received: ${prisonerId}`,
    );

    logger.info(
      `PrisonApiRepository (getDamageObligationsFor) - User: ${prisonerId}`,
    );

    try {
      const response = await this.client.get(
        `${this.url}/api/offenders/${prisonerId}/damage-obligations`,
      );

      return response;
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        `PrisonApiRepository (getDamageObligationsFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }
}

module.exports = PrisonApiRepository;
