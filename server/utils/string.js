const { capitalize } = require('./index');

const fullNameOrDefault = (placeHolder, ...names) => {
  const fullName = names.map(capitalize).join(' ').trim();
  return fullName === '' ? placeHolder : fullName;
};

const formatBalanceOrDefault = (placeHolder, amount, currency) =>
  amount !== null && !Number.isNaN(Number(amount)) && currency
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
      }).format(amount)
    : placeHolder;

module.exports = {
  fullNameOrDefault,
  formatBalanceOrDefault,
};
