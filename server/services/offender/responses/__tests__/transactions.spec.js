const { Transaction } = require('../transaction');

describe('Transaction', () => {
  it('Should provide money in when transaction is positive', () => {
    const response = {
      entryDate: '2021-02-12',
      postingType: 'CR',
      penceAmount: 250,
      currentBalance: -443,
      entryDescription: 'Television',
      agencyId: 'MDI',
      currency: 'GBP',
    };

    const formatted = Transaction.from(response).format();

    expect(formatted.paymentDate).toBe('12 February 2021');
    expect(formatted.moneyIn).toBe('£2.50');
    expect(formatted.moneyOut).toBe(null);
    expect(formatted.balance).toBe('-£4.43');
    expect(formatted.paymentDescription).toBe('Television');
    expect(formatted.prison).toBe('MDI');
  });

  it('Should provide money out when transaction is negative', () => {
    const response = {
      entryDate: '2021-02-12',
      postingType: 'DR',
      penceAmount: 250,
      currentBalance: 443,
      entryDescription: 'Television',
      agencyId: 'MDI',
      currency: 'GBP',
    };

    const formatted = Transaction.from(response).format();

    expect(formatted.paymentDate).toBe('12 February 2021');
    expect(formatted.moneyIn).toBe(null);
    expect(formatted.moneyOut).toBe('£2.50');
    expect(formatted.balance).toBe('£4.43');
    expect(formatted.paymentDescription).toBe('Television');
    expect(formatted.prison).toBe('MDI');
  });
});
