const { Balances } = require('../balances');

const DEFAULT = null;

describe('Balances', () => {
  it('should handle an empty response', () => {
    const balances = Balances.from();

    expect(balances.spends).not.toBeDefined();
    expect(balances.privateAccount).not.toBeDefined();
    expect(balances.savings).not.toBeDefined();
    expect(balances.currency).not.toBeDefined();

    const formatted = balances.format();

    expect(formatted.spends).toBe(DEFAULT);
    expect(formatted.privateAccount).toBe(DEFAULT);
    expect(formatted.savings).toBe(DEFAULT);
    expect(formatted.currency).toBe(DEFAULT);
  });

  it('should not assume the currency when handling an incomplete response', () => {
    const response = {
      spends: '100',
      cash: '100',
      savings: '0',
    };

    const formatted = Balances.from(response).format();

    expect(formatted).toStrictEqual({
      spends: DEFAULT,
      privateAccount: DEFAULT,
      savings: DEFAULT,
      currency: DEFAULT,
    });
  });

  it('should format to the prescribed currency', () => {
    const response = {
      spends: '100',
      currency: 'HKD',
    };

    const formatted = Balances.from(response).format();

    expect(formatted).toStrictEqual({
      spends: 'HK$100.00',
      privateAccount: DEFAULT,
      savings: DEFAULT,
      currency: 'HKD',
    });
  });

  it('should format data when passed', () => {
    const response = {
      spends: '100',
      cash: '100',
      savings: '0',
      currency: 'GBP',
    };

    const formatted = Balances.from(response).format();

    expect(formatted).toStrictEqual({
      spends: '£100.00',
      privateAccount: '£100.00',
      savings: '£0.00',
      currency: 'GBP',
    });
  });
});
