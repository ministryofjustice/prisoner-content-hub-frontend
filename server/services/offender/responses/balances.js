const {
  placeholders: { DEFAULT },
} = require('../../../utils/enums');
const { formatBalanceOr } = require('../../../utils/string');

class Balances {
  constructor(options = {}) {
    const { spends, cash, savings, currency } = options;
    this.spends = spends;
    this.cash = cash;
    this.savings = savings;
    this.currency = currency;
  }

  format() {
    return {
      spends: formatBalanceOr(DEFAULT, this.spends, this.currency),
      cash: formatBalanceOr(DEFAULT, this.cash, this.currency),
      savings: formatBalanceOr(DEFAULT, this.savings, this.currency),
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
