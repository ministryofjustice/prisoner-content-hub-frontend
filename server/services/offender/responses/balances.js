const { formatBalanceOrDefault } = require('../../../utils/string');

const DEFAULT = null;

class Balances {
  constructor(options = {}) {
    const { spends, cash, savings, currency } = options;
    this.spends = spends;
    this.private = cash;
    this.savings = savings;
    this.currency = currency;
  }

  format() {
    return {
      spends: formatBalanceOrDefault(DEFAULT, this.spends, this.currency),
      private: formatBalanceOrDefault(DEFAULT, this.private, this.currency),
      savings: formatBalanceOrDefault(DEFAULT, this.savings, this.currency),
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
