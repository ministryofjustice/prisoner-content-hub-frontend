const { formatBalanceOrDefault } = require('../string');

describe('StringUtils', () => {
  describe('formatBalanceOrDefault', () => {
    it('should format currency', () => {
      const balance = formatBalanceOrDefault('', 5.0, 'GBP');
      expect(balance).toBe('£5.00');
    });

    it('should handle zero', () => {
      const balance = formatBalanceOrDefault('', 0.0, 'GBP');
      expect(balance).toBe('£0.00');
    });

    it('should return the placeholder if null amount passed', () => {
      const balance = formatBalanceOrDefault('PLACEHOLDER', null, 'GBP');
      expect(balance).toBe('PLACEHOLDER');
    });

    it('should return the placeholder if undefined amount passed', () => {
      const balance = formatBalanceOrDefault('PLACEHOLDER', undefined, 'GBP');
      expect(balance).toBe('PLACEHOLDER');
    });

    it('should return the placeholder if no currency type passed', () => {
      const balance = formatBalanceOrDefault('PLACEHOLDER', 5.0);
      expect(balance).toBe('PLACEHOLDER');
    });
  });
});
