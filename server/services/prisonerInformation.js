function createPrisonMapFrom(prisonDetailsResponse) {
  return prisonDetailsResponse
    .filter(p => p !== null)
    .reduce((a, p) => {
      a.set(p.agencyId, p.longDescription);
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

class PrisonerInformationService {
  constructor({ prisonApiRepository }) {
    this.prisonApi = prisonApiRepository;
  }

  async getTransactionInformationFor(user, accountCode, fromDate, toDate) {
    if (!user || !accountCode || !fromDate || !toDate) {
      throw new Error('Incorrect parameters passed');
    }

    const [transactionsResponse, balancesResponse] = await Promise.all([
      this.prisonApi.getTransactionsFor({
        prisonerId: user.prisonerId,
        accountCode,
        fromDate,
        toDate,
      }),
      this.prisonApi.getBalancesFor(user.bookingId),
    ]);

    const balances = balancesResponse || {
      error: 'We are not able to show your balances at this time',
    };

    if (transactionsResponse) {
      const listOfPrisons = Array.from(
        new Set(transactionsResponse.map(t => t.agencyId)),
      );
      const prisonDetailsResponse = await Promise.all(
        listOfPrisons.map(p => this.prisonApi.getPrisonDetailsFor(p)),
      );

      const prisonDetailsMap = createPrisonMapFrom(prisonDetailsResponse);
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
  }
}

module.exports = {
  PrisonerInformationService,
};
