const { capitalize } = require('./index');

const formatPrisonName = description => {
  if (typeof description !== 'string') {
    return '';
  }
  if (!description.match(/^(HMP|HMYOI) (.+)$/)) {
    return description;
  }
  return description
    .split(' ')
    .map((word, pos) => (pos > 0 ? capitalize(word) : word))
    .join(' ');
};

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
  formatPrisonName,
};
