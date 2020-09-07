const {
  formatDateOrDefault,
  formatTimeBetweenOrDefault,
} = require('../../server/utils/date');

describe('DateUtils', () => {
  describe('formatDateOrDefault', () => {
    it('should format a valid date', () => {
      const formatted = formatDateOrDefault(
        'PLACEHOLDER',
        'EEEE dd MMMM yyyy',
        '2020-09-04',
      );
      expect(formatted).to.equal('Friday 04 September 2020');
    });

    it('should return the placeholder when date is invalid', () => {
      const formatted = formatDateOrDefault(
        'PLACEHOLDER',
        'EEEE dd MMMM yyyy',
        'invalid-date',
      );
      expect(formatted).to.equal('PLACEHOLDER');
    });

    it('should return the placeholder when date is not provided', () => {
      const formatted = formatDateOrDefault(
        'PLACEHOLDER',
        'EEEE dd MMMM yyyy',
        undefined,
      );
      expect(formatted).to.equal('PLACEHOLDER');
    });
  });

  describe('formatTimeBetweenOrDefault', () => {
    it('should return a formatted range between two dates', () => {
      const formatted = formatTimeBetweenOrDefault(
        'PLACEHOLDER',
        '2020-08-01',
        '2020-09-01',
      );
      expect(formatted).to.match(/1 month/i);
    });

    it('should use now when not provided an end date', () => {
      const clock = sinon.useFakeTimers({
        now: new Date('2020-09-01T12:00:00').getTime(),
      });

      const formatted = formatTimeBetweenOrDefault('PLACEHOLDER', '2020-08-01');
      expect(formatted).to.match(/1 month/i);

      clock.restore();
    });

    it('should return a placeholder when no start date provided', () => {
      const formatted = formatTimeBetweenOrDefault('PLACEHOLDER', undefined);
      expect(formatted).to.equal('PLACEHOLDER');
    });
  });
});
