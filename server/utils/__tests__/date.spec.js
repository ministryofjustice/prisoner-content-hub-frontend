const {
  formatDateOrDefault,
  formatTimeBetweenOrDefault,
  getDateSelection,
  isAdult,
} = require('../date');

describe('DateUtils', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('formatDateOrDefault', () => {
    it('should format a valid date', () => {
      const formatted = formatDateOrDefault(
        'PLACEHOLDER',
        'EEEE dd MMMM yyyy',
        '2020-09-04',
      );
      expect(formatted).toBe('Friday 04 September 2020');
    });

    it('should return the placeholder when date is invalid', () => {
      const formatted = formatDateOrDefault(
        'PLACEHOLDER',
        'EEEE dd MMMM yyyy',
        'invalid-date',
      );
      expect(formatted).toBe('PLACEHOLDER');
    });

    it('should return the placeholder when date is not provided', () => {
      const formatted = formatDateOrDefault(
        'PLACEHOLDER',
        'EEEE dd MMMM yyyy',
        undefined,
      );
      expect(formatted).toBe('PLACEHOLDER');
    });
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

describe('getDateSelectionFrom', () => {
  it('defaults to generating the previous 12 months from today', () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2021-03-10T12:00:00').getTime());

    const dateRange = getDateSelection();
    expect(dateRange).toEqual([
      { text: 'March 2021', value: '2021-03-01' },
      { text: 'February 2021', value: '2021-02-01' },
      { text: 'January 2021', value: '2021-01-01' },
      { text: 'December 2020', value: '2020-12-01' },
      { text: 'November 2020', value: '2020-11-01' },
      { text: 'October 2020', value: '2020-10-01' },
      { text: 'September 2020', value: '2020-09-01' },
      { text: 'August 2020', value: '2020-08-01' },
      { text: 'July 2020', value: '2020-07-01' },
      { text: 'June 2020', value: '2020-06-01' },
      { text: 'May 2020', value: '2020-05-01' },
      { text: 'April 2020', value: '2020-04-01' },
    ]);
  });

  it('allows you to specify the date', () => {
    const dateRange = getDateSelection(new Date('2021-02-18'));
    expect(dateRange).toEqual([
      { text: 'February 2021', value: '2021-02-01' },
      { text: 'January 2021', value: '2021-01-01' },
      { text: 'December 2020', value: '2020-12-01' },
      { text: 'November 2020', value: '2020-11-01' },
      { text: 'October 2020', value: '2020-10-01' },
      { text: 'September 2020', value: '2020-09-01' },
      { text: 'August 2020', value: '2020-08-01' },
      { text: 'July 2020', value: '2020-07-01' },
      { text: 'June 2020', value: '2020-06-01' },
      { text: 'May 2020', value: '2020-05-01' },
      { text: 'April 2020', value: '2020-04-01' },
      { text: 'March 2020', value: '2020-03-01' },
    ]);
  });

  it('allows you to specify the selected date', () => {
    const dateRange = getDateSelection(
      new Date('2021-02-18'),
      new Date('2021-01-27'),
    );
    expect(dateRange).toEqual([
      { text: 'February 2021', value: '2021-02-01' },
      { text: 'January 2021', value: '2021-01-01', selected: true },
      { text: 'December 2020', value: '2020-12-01' },
      { text: 'November 2020', value: '2020-11-01' },
      { text: 'October 2020', value: '2020-10-01' },
      { text: 'September 2020', value: '2020-09-01' },
      { text: 'August 2020', value: '2020-08-01' },
      { text: 'July 2020', value: '2020-07-01' },
      { text: 'June 2020', value: '2020-06-01' },
      { text: 'May 2020', value: '2020-05-01' },
      { text: 'April 2020', value: '2020-04-01' },
      { text: 'March 2020', value: '2020-03-01' },
    ]);
  });

  it('allows you to specify the size of the date range', () => {
    const dateRange = getDateSelection(new Date('2021-02-18'), null, 6);
    expect(dateRange).toEqual([
      { text: 'February 2021', value: '2021-02-01' },
      { text: 'January 2021', value: '2021-01-01' },
      { text: 'December 2020', value: '2020-12-01' },
      { text: 'November 2020', value: '2020-11-01' },
      { text: 'October 2020', value: '2020-10-01' },
      { text: 'September 2020', value: '2020-09-01' },
    ]);
  });
});

describe('isAdult', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2018-01-02').getTime());
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it('returns true with birth dates over 18', () => {
    expect(isAdult('2000-01-02')).toEqual(true);
    expect(isAdult('1992-12-25')).toEqual(true);
  });
  it('returns true with birth dates under 18', () => {
    expect(isAdult('2000-01-01')).toEqual(false);
    expect(isAdult('2003-01-01')).toEqual(false);
  });
});
