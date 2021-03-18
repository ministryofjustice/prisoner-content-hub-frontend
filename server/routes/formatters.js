const { parseISO } = require('date-fns');
const { formatBalanceOrDefault } = require('../utils/string');
const { formatDateOrDefault, sortByDateTime } = require('../utils/date');

function formatTransaction(transaction) {
  return {
    paymentDate: formatDateOrDefault('', 'd MMMM yyyy', transaction.entryDate),
    balance: formatBalanceOrDefault(
      null,
      transaction.currentBalance / 100,
      transaction.currency,
    ),
    moneyIn:
      transaction.postingType === 'CR'
        ? formatBalanceOrDefault(
            null,
            transaction.penceAmount / 100,
            transaction.currency,
          )
        : null,
    moneyOut:
      transaction.postingType === 'DR'
        ? formatBalanceOrDefault(
            null,
            0 - transaction.penceAmount / 100,
            transaction.currency,
          )
        : null,
    paymentDescription: transaction.entryDescription,
    prison: transaction.prison,
  };
}

function formatBalance(accountType, balances) {
  const balance = balances[accountType];
  return {
    amount: formatBalanceOrDefault(null, balance, balances.currency),
  };
}

function flattenTransactions(transactions) {
  const batchTransactionsOnly = transaction =>
    Array.isArray(transaction.relatedOffenderTransactions) &&
    transaction.relatedOffenderTransactions.length;

  const sortByRecentEntryDateThenByRecentCalendarDate = (
    transaction1,
    transaction2,
  ) => {
    const diff =
      parseISO(transaction2.entryDate).valueOf() -
      parseISO(transaction1.entryDate).valueOf();

    if (diff !== 0) {
      return diff;
    }

    if (transaction1.calendarDate && transaction2.calendarDate) {
      return (
        parseISO(transaction2.calendarDate).valueOf() -
        parseISO(transaction1.calendarDate).valueOf()
      );
    }

    return 0;
  };
  const sortByOldestCalendarDate = (transaction1, transaction2) =>
    sortByDateTime(transaction2.calendarDate, transaction1.calendarDate);

  const relatedTransactions = transactions
    .filter(batchTransactionsOnly)
    .flatMap(batchTransaction => {
      const related = batchTransaction.relatedOffenderTransactions
        .sort(sortByOldestCalendarDate)
        .map(relatedTransaction => ({
          entryDate: batchTransaction.entryDate,
          penceAmount: relatedTransaction.payAmount,
          entryDescription: `${
            relatedTransaction.paymentDescription
          } from ${formatDateOrDefault(
            '',
            'd MMMM yyyy',
            relatedTransaction.calendarDate,
          )}`,
          postingType: 'CR',
          currency: batchTransaction.currency,
          prison: batchTransaction.prison,
        }));

      let adjustedBalance = batchTransaction.currentBalance;

      return related.map(current => {
        const withBalance = {
          ...current,
          currentBalance: adjustedBalance,
        };
        adjustedBalance -= current.penceAmount;
        return withBalance;
      });
    });

  const transactionsExcludingRelated = transactions.filter(
    transaction => !batchTransactionsOnly(transaction),
  );

  return [...transactionsExcludingRelated, ...relatedTransactions].sort(
    sortByRecentEntryDateThenByRecentCalendarDate,
  );
}

function formatTransactionPageData(accountType, transactionsData) {
  if (transactionsData) {
    const { balances, transactions } = transactionsData;

    return {
      balance: balances.error
        ? { error: balances.error }
        : formatBalance(accountType, balances),
      transactions: transactions.error
        ? { error: transactions.error }
        : flattenTransactions(transactions).map(formatTransaction),
    };
  }

  return {};
}

function formatDamageObligations(damageObligations) {
  if (damageObligations.error) {
    return damageObligations;
  }

  const activeDamageObligations = damageObligations.filter(
    damageObligation => damageObligation.status === 'ACTIVE',
  );

  const totalRemainingAmount = activeDamageObligations
    .filter(damageObligation => damageObligation.currency === 'GBP')
    .reduce(
      (runningTotal, damageObligation) =>
        runningTotal +
        (damageObligation.amountToPay - damageObligation.amountPaid),
      0,
    );

  const rows = activeDamageObligations.map(damageObligation => {
    const startDate = formatDateOrDefault(
      'Unknown',
      'd MMMM yyyy',
      damageObligation.startDateTime,
    );
    const endDate = formatDateOrDefault(
      'Unknown',
      'd MMMM yyyy',
      damageObligation.endDateTime,
    );

    return {
      adjudicationNumber: damageObligation.referenceNumber,
      timePeriod:
        damageObligation.startDateTime && damageObligation.endDateTime
          ? `${startDate} to ${endDate}`
          : 'Unknown',
      totalAmount: formatBalanceOrDefault(
        null,
        damageObligation.amountToPay,
        damageObligation.currency,
      ),
      amountPaid: formatBalanceOrDefault(
        null,
        damageObligation.amountPaid,
        damageObligation.currency,
      ),
      amountOwed: formatBalanceOrDefault(
        null,
        damageObligation.amountToPay - damageObligation.amountPaid,
        damageObligation.currency,
      ),
      prison: damageObligation.prison,
      description: damageObligation.comment,
    };
  });

  return {
    rows,
    totalRemainingAmount: formatBalanceOrDefault(
      null,
      totalRemainingAmount,
      'GBP',
    ),
  };
}

module.exports = {
  formatTransactionPageData,
  formatDamageObligations,
};
