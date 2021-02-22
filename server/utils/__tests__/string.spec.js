const {
  fullNameOrDefault,
  formatBalanceOrDefault,
  formatPrisonName,
} = require('../string');

describe('StringUtils', () => {
  describe('fullNameOrDefault', () => {
    it('should format multiple names', () => {
      const fullName = fullNameOrDefault('', 'FOO', 'BAR', 'BAZ');
      expect(fullName).toBe('Foo Bar Baz');
    });

    it('should format a single name', () => {
      const fullName = fullNameOrDefault('', 'FOO');
      expect(fullName).toBe('Foo');
    });

    it('should handle bad data', () => {
      const fullName = fullNameOrDefault('PLACEHOLDER', undefined, '');
      expect(fullName).toBe('PLACEHOLDER');
    });
  });

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

describe('formatPrisonName', () => {
  it('should format HMP prisons', () => {
    const formatted = formatPrisonName('HMP TEST PRISON');
    expect(formatted).toBe('HMP Test Prison');
  });

  it('should format HMYOI prisons', () => {
    const formatted = formatPrisonName('HMYOI TEST PRISON');
    expect(formatted).toBe('HMYOI Test Prison');
  });

  it('handle and empty string', () => {
    const formatted = formatPrisonName('');
    expect(formatted).toBe('');
  });
});
