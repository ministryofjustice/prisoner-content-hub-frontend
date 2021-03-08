const { formatBalanceOrDefault } = require('../utils/string');
const { formatDateOrDefault } = require('../utils/date');

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
            transaction.penceAmount / 100,
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

function formatTransactionPageData(accountType, transactionsData) {
  if (transactionsData) {
    const { balances, transactions } = transactionsData;
    return {
      balance: balances.error
        ? { error: balances.error }
        : formatBalance(accountType, balances),
      transactions: transactions.error
        ? { error: transactions.error }
        : transactions.map(formatTransaction),
    };
  }

  return {};
}

module.exports = {
  formatTransactionPageData,
};
