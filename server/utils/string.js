const formatBalanceOrDefault = (placeHolder, amount, currency) =>
  amount !== null && !Number.isNaN(Number(amount)) && currency
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
      }).format(amount)
    : placeHolder;

module.exports = {
  formatBalanceOrDefault,
};
