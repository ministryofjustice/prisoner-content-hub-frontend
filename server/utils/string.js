const { capitalize } = require('./index');

const fullNameOr = (placeHolder, ...names) => {
  const fullName = names.map(capitalize).join(' ').trim();
  return fullName === '' ? placeHolder : fullName;
};

const formatBalanceOr = (placeHolder, amount, currency) => {
  return amount && currency
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
      }).format(amount)
    : placeHolder;
};

module.exports = {
  fullNameOr,
  formatBalanceOr,
};
