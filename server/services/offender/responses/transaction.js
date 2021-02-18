const { formatBalanceOrDefault } = require('../../../utils/string');
const {
  placeholders: { DEFAULT },
  dateFormats: { TRANSACTION_FORMAT },
} = require('../../../utils/enums');
const { formatDateOrDefault } = require('../../../utils/date');

class Transaction {
  constructor(options = {}) {
    const {
      entryDate,
      penceAmount,
      postingType,
      currentBalance,
      entryDescription,
      agencyId,
      currency,
    } = options;
    this.paymentDate = entryDate;
    this.postingType = postingType;
    this.amount = penceAmount / 100;
    this.currency = currency;
    this.balance = currentBalance / 100;
    this.paymentDescription = entryDescription;
    this.prison = agencyId;
  }

  format() {
    return {
      paymentDate: formatDateOrDefault(
        DEFAULT,
        TRANSACTION_FORMAT,
        this.paymentDate,
      ),
      moneyIn:
        this.postingType === 'CR'
          ? formatBalanceOrDefault(null, this.amount, this.currency)
          : null,
      moneyOut:
        this.postingType === 'DR'
          ? formatBalanceOrDefault(null, this.amount, this.currency)
          : null,
      balance: formatBalanceOrDefault(DEFAULT, this.balance, this.currency),
      paymentDescription: this.paymentDescription,
      prison: this.prison,
    };
  }

  static from(response = {}) {
    return new Transaction(response);
  }
}

module.exports = {
  Transaction,
};
