const { fullNameOr, formatBalanceOr } = require('../../server/utils/string');

describe('StringUtils', () => {
  describe('fullNameOr', () => {
    it('should format multiple names', () => {
      const fullName = fullNameOr('', 'FOO', 'BAR', 'BAZ');
      expect(fullName).to.equal('Foo Bar Baz');
    });

    it('should format a single name', () => {
      const fullName = fullNameOr('', 'FOO');
      expect(fullName).to.equal('Foo');
    });

    it('should handle bad data', () => {
      const fullName = fullNameOr('PLACEHOLDER', undefined, '');
      expect(fullName).to.equal('PLACEHOLDER');
    });
  });

  describe('formatBalanceOr', () => {
    it('should format currency', () => {
      const balance = formatBalanceOr('', 5.0, 'GBP');
      expect(balance).to.equal('£5.00');
    });

    it('should return the placeholder if no amount passed', () => {
      const balance = formatBalanceOr('PLACEHOLDER', null, 'GBP');
      expect(balance).to.equal('PLACEHOLDER');
    });

    it('should return the placeholder if no currency type passed', () => {
      const balance = formatBalanceOr('PLACEHOLDER', 5.0);
      expect(balance).to.equal('PLACEHOLDER');
    });
  });
});
