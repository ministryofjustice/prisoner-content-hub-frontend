const {
  placeholders: { DEFAULT },
} = require('../../../utils/enums');

class Balances {
  constructor(options = {}) {
    const { spends, cash, savings, currency } = options;
    this.spends = spends;
    this.cash = cash;
    this.savings = savings;
    this.currency = currency;
  }

  format() {
    const formatBalance = (amount, currency) => {
      return amount && currency
        ? new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency,
          }).format(amount)
        : DEFAULT;
    };

    return {
      spends: formatBalance(this.spends, this.currency),
      cash: formatBalance(this.cash, this.currency),
      savings: formatBalance(this.savings, this.currency),
      currency: this.currency || DEFAULT,
    };
  }

  static from(response = {}) {
    return new Balances(response);
  }
}

module.exports = {
  Balances,
};
