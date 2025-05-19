const { formatBalanceOrDefault } = require('../../../utils/string');

const DEFAULT = null;

class Balances {
  constructor(options = {}) {
    const { spends, cash, savings, currency } = options;
    this.spends = spends;
    this.privateAccount = cash;
    this.savings = savings;
    this.currency = currency;
  }

  format() {
    return {
      spends: formatBalanceOrDefault(DEFAULT, this.spends, this.currency),
      privateAccount: formatBalanceOrDefault(
        DEFAULT,
        this.privateAccount,
        this.currency,
      ),
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
