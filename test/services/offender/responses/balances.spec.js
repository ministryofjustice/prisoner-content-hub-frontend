const {
  Balances,
} = require('../../../../server/services/offender/responses/balances');

const DEFAULT = null;

describe('Balances', () => {
  it('Should handle an empty response', () => {
    const balances = Balances.from();

    expect(balances.spends).to.not.exist;
    expect(balances.cash).to.not.exist;
    expect(balances.savings).to.not.exist;
    expect(balances.currency).to.not.exist;

    const formatted = balances.format();

    expect(formatted.spends).to.equal(DEFAULT);
    expect(formatted.cash).to.equal(DEFAULT);
    expect(formatted.savings).to.equal(DEFAULT);
    expect(formatted.currency).to.equal(DEFAULT);
  });

  it('should handle an incomplete response', () => {
    let response = {
      spends: '100',
      cash: '100',
      savings: '0',
    };

    let formatted = Balances.from(response).format();

    expect(formatted).to.eql(
      {
        spends: DEFAULT,
        cash: DEFAULT,
        savings: DEFAULT,
        currency: DEFAULT,
      },
      'It should not assume the currency',
    );

    response = {
      spends: '100',
      currency: 'GBP',
    };

    formatted = Balances.from(response).format();

    expect(formatted).to.eql({
      spends: '£100.00',
      cash: DEFAULT,
      savings: DEFAULT,
      currency: 'GBP',
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

    expect(formatted).to.eql({
      spends: '£100.00',
      cash: '£100.00',
      savings: '£0.00',
      currency: 'GBP',
    });
  });
});
