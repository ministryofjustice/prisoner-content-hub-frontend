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
    if (transaction1.entryDate && transaction2.entryDate)
      return (
        parseISO(transaction2.entryDate).valueOf() -
        parseISO(transaction1.entryDate).valueOf()
      );
    if (transaction1.entryDate) return -1;
    if (transaction2.entryDate) return 1;

    if (transaction1.calendarDate && transaction2.calendarDate)
      return (
        parseISO(transaction2.calendarDate).valueOf() -
        parseISO(transaction1.calendarDate).valueOf()
      );
    if (transaction1.calendarDate) return -1;
    if (transaction2.calendarDate) return 1;

    return 0;
  };
  const sortByOldestCalendarDate = (transaction1, transaction2) =>
    sortByDateTime(transaction1.calendarDate, transaction2.calendarDate);

  const relatedTransactions = transactions
    .filter(batchTransactionsOnly)
    .sort(sortByOldestCalendarDate)
    .flatMap(batchTransaction => {
      const related = batchTransaction.relatedOffenderTransactions.map(
        relatedTransaction => ({
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
        }),
      );

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

module.exports = {
  formatTransactionPageData,
};
