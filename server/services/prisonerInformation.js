const Sentry = require('@sentry/node');

const { logger } = require('../utils/logger');

function createPrisonFormatter(listOfPrisons, key) {
  const lookup = listOfPrisons.reduce((a, p) => {
    a.set(p.agencyId, p.description);
    return a;
  }, new Map());

  return v => ({
    ...v,
    prison: lookup.has(v[key]) ? lookup.get(v[key]) : v[key],
  });
}

class PrisonerInformationService {
  constructor({ prisonApiRepository }) {
    this.prisonApi = prisonApiRepository;
  }

  async getPrivateTransactionsFor(user, fromDate, toDate) {
    if (!user || !fromDate || !toDate) {
      throw new Error('Incorrect parameters passed');
    }

    try {
      const [
        transactionsResponse,
        balancesResponse,
        listOfPrisonsResponse,
        addHoldFundsResponse,
        withheldFundsResponse,
      ] = await Promise.all([
        this.prisonApi.getTransactionsForDateRange(user.prisonerId, {
          accountCode: 'cash',
          fromDate,
          toDate,
        }),
        this.prisonApi.getBalancesFor(user.bookingId),
        this.prisonApi.getPrisonDetails(),
        this.prisonApi.getTransactionsByType(user.prisonerId, {
          accountCode: 'cash',
          transactionType: 'HOA',
        }),
        this.prisonApi.getTransactionsByType(user.prisonerId, {
          accountCode: 'cash',
          transactionType: 'WHF',
        }),
      ]);

      const listOfPrisons = listOfPrisonsResponse || [];
      const convertPrisonIdToText = createPrisonFormatter(
        listOfPrisons,
        'agencyId',
      );

      const transactionData = {
        transactions: transactionsResponse
          ? transactionsResponse.map(convertPrisonIdToText)
          : null,
        balances: balancesResponse,
      };

      transactionData.pending =
        Array.isArray(addHoldFundsResponse) &&
        Array.isArray(withheldFundsResponse)
          ? [
              ...addHoldFundsResponse.map(convertPrisonIdToText),
              ...withheldFundsResponse.map(convertPrisonIdToText),
            ]
          : null;

      return transactionData;
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        `PrisonerInformationService (getPrivateTransactionsDataFor) - Failed: ${e.message}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }

  async getTransactionsFor(user, accountCode, fromDate, toDate) {
    if (!user || !accountCode || !fromDate || !toDate) {
      throw new Error('Incorrect parameters passed');
    }

    try {
      const [
        transactionsResponse,
        balancesResponse,
        listOfPrisonsResponse,
      ] = await Promise.all([
        this.prisonApi.getTransactionsForDateRange(user.prisonerId, {
          accountCode,
          fromDate,
          toDate,
        }),
        this.prisonApi.getBalancesFor(user.bookingId),
        this.prisonApi.getPrisonDetails(),
      ]);

      const listOfPrisons = listOfPrisonsResponse || [];
      const convertPrisonIdToText = createPrisonFormatter(
        listOfPrisons,
        'agencyId',
      );

      const transactionData = {
        transactions: transactionsResponse
          ? transactionsResponse.map(convertPrisonIdToText)
          : null,
        balances: balancesResponse,
      };

      return transactionData;
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        `PrisonerInformationService (getTransactionInformationFor) - Failed: ${e.message}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }

  async getDamageObligationsFor(user) {
    if (!user) {
      throw new Error('Incorrect parameters passed');
    }

    try {
      const [
        damageObligationsResponse,
        listOfPrisonsResponse,
      ] = await Promise.all([
        this.prisonApi.getDamageObligationsFor(user.prisonerId),
        this.prisonApi.getPrisonDetails(),
      ]);

      const listOfPrisons = listOfPrisonsResponse || [];
      const formatPrison = createPrisonFormatter(listOfPrisons, 'prisonId');

      return damageObligationsResponse &&
        Array.isArray(damageObligationsResponse.damageObligations)
        ? damageObligationsResponse.damageObligations.map(formatPrison)
        : null;
    } catch (e) {
      Sentry.captureException(e);
      logger.error(
        `PrisonerInformationService (getDamageObligationsFor) - Failed: ${e.message}`,
      );
      logger.debug(e.stack);
      return null;
    }
  }
}

module.exports = PrisonerInformationService;
