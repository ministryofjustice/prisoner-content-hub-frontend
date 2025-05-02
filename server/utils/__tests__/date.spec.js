const { formatTimeBetweenOrDefault, getOffsetUnixTime } = require('../date');

describe('DateUtils', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('formatTimeBetweenOrDefault', () => {
    it('should return a formatted range between two dates', () => {
      const formatted = formatTimeBetweenOrDefault(
        'PLACEHOLDER',
        '2020-08-01',
        '2020-09-01',
      );
      expect(formatted).toMatch(/1 month/i);
    });

    it('should use now when not provided an end date', () => {
      jest
        .useFakeTimers('modern')
        .setSystemTime(new Date('2020-09-01T12:00:00').getTime());

      const formatted = formatTimeBetweenOrDefault('PLACEHOLDER', '2020-08-01');
      expect(formatted).toMatch(/1 month/i);
    });

    it('should return a placeholder when no start date provided', () => {
      const formatted = formatTimeBetweenOrDefault('PLACEHOLDER', undefined);
      expect(formatted).toBe('PLACEHOLDER');
    });
  });
});

describe('getOffsetUnixTime', () => {
  const NOW_MILLISECONDS = 1577836800;
  let now;

  beforeEach(() => {
    now = new Date('2020-01-01');
  });

  it('should handle no offset value ', () => {
    expect(getOffsetUnixTime(null, now)).toBe(NOW_MILLISECONDS);
  });

  it('should handle a real offset value ', () => {
    expect(getOffsetUnixTime(27, now)).toBe(1575504000);
  });

  it('should handle a negative offset value ', () => {
    expect(getOffsetUnixTime(-27, now)).toBe(1580169600);
  });

  it('should default to the current date ', () => {
    jest.useFakeTimers().setSystemTime(now);

    expect(getOffsetUnixTime(null, null)).toBe(NOW_MILLISECONDS);

    jest.useRealTimers();
  });
});
