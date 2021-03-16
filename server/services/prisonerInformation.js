const Sentry = require('@sentry/node');

const { logger } = require('../utils/logger');

function createPrisonMapFrom(prisonDetailsResponse) {
  return prisonDetailsResponse.reduce((a, p) => {
    a.set(p.agencyId, p.formattedDescription);
    return a;
  }, new Map());
}

function formatTransactionsWith(transactions, prisonDetails) {
  return transactions.map(t => ({
    ...t,
    prison: prisonDetails.has(t.agencyId)
      ? prisonDetails.get(t.agencyId)
      : t.agencyId,
  }));
}

function formatDamageObligationsWith(damageObligations, prisonDetails) {
  return damageObligations.map(o => ({
    ...o,
    prison: prisonDetails.has(o.prisonId)
      ? prisonDetails.get(o.prisonId)
      : o.prisonId,
  }));
}

class PrisonerInformationService {
  constructor({ prisonApiRepository }) {
    this.prisonApi = prisonApiRepository;
  }

  async getTransactionInformationFor(user, accountCode, fromDate, toDate) {
    if (!user || !accountCode || !fromDate || !toDate) {
      throw new Error('Incorrect parameters passed');
    }

    try {
      const [
        transactionsResponse,
        balancesResponse,
        listOfPrisons,
      ] = await Promise.all([
        this.prisonApi.getTransactionsFor(
          user.prisonerId,
          accountCode,
          fromDate,
          toDate,
        ),
        this.prisonApi.getBalancesFor(user.bookingId),
        this.prisonApi.getPrisonDetails(),
      ]);

      const balances = balancesResponse || {
        error: 'We are not able to show your balances at this time',
      };

      if (transactionsResponse) {
        const prisonDetailsMap = createPrisonMapFrom(listOfPrisons);
        const formattedTransactions = formatTransactionsWith(
          transactionsResponse,
          prisonDetailsMap,
        );

        return {
          transactions: formattedTransactions,
          balances,
        };
      }

      return {
        transactions: {
          error: 'We are not able to show your transactions at this time',
        },
        balances,
      };
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
      const [damageObligations, listOfPrisons] = await Promise.all([
        this.prisonApi.getDamageObligationsFor(user.prisonerId),
        this.prisonApi.getPrisonDetails(),
      ]);

      if (damageObligations) {
        const prisonDetailsMap = createPrisonMapFrom(listOfPrisons);
        const formattedDamageObligations = formatDamageObligationsWith(
          damageObligations,
          prisonDetailsMap,
        );

        return formattedDamageObligations;
      }

      return {
        error: 'We are unable to show your damage obligations at this time',
      };
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

module.exports = {
  PrisonerInformationService,
};