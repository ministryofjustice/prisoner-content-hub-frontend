const {
  fullNameOrDefault,
  formatBalanceOrDefault,
} = require('../../server/utils/string');

describe('StringUtils', () => {
  describe('fullNameOrDefault', () => {
    it('should format multiple names', () => {
      const fullName = fullNameOrDefault('', 'FOO', 'BAR', 'BAZ');
      expect(fullName).to.equal('Foo Bar Baz');
    });

    it('should format a single name', () => {
      const fullName = fullNameOrDefault('', 'FOO');
      expect(fullName).to.equal('Foo');
    });

    it('should handle bad data', () => {
      const fullName = fullNameOrDefault('PLACEHOLDER', undefined, '');
      expect(fullName).to.equal('PLACEHOLDER');
    });
  });

  describe('formatBalanceOrDefault', () => {
    it('should format currency', () => {
      const balance = formatBalanceOrDefault('', 5.0, 'GBP');
      expect(balance).to.equal('£5.00');
    });

    it('should handle zero', () => {
      const balance = formatBalanceOrDefault('', 0.0, 'GBP');
      expect(balance).to.equal('£0.00');
    });

    it('should return the placeholder if null amount passed', () => {
      const balance = formatBalanceOrDefault('PLACEHOLDER', null, 'GBP');
      expect(balance).to.equal('PLACEHOLDER');
    });

    it('should return the placeholder if undefined amount passed', () => {
      const balance = formatBalanceOrDefault('PLACEHOLDER', undefined, 'GBP');
      expect(balance).to.equal('PLACEHOLDER');
    });

    it('should return the placeholder if no currency type passed', () => {
      const balance = formatBalanceOrDefault('PLACEHOLDER', 5.0);
      expect(balance).to.equal('PLACEHOLDER');
    });
  });
});
