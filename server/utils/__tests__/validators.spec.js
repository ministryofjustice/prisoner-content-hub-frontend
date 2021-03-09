const {
  isValidPrisonerId,
  isValidBookingId,
  isValidAccountCode,
  isValidDate,
  isValidPrisonId,
} = require('../validators');

describe('Validators', () => {
  describe('isValidPrisonerId', () => {
    it('returns truthy when the string passed matches the format A1234BC', () => {
      expect(isValidPrisonerId('A1234BC')).toBeTruthy();
    });

    it('returns falsy when the string passed is not in the correct format', () => {
      expect(isValidPrisonerId('')).toBeFalsy();
      expect(isValidPrisonerId('AB1234C')).toBeFalsy();
      expect(isValidPrisonerId('A1234BCD')).toBeFalsy();
      expect(isValidPrisonerId('AB1234CD')).toBeFalsy();
    });

    it('returns falsy when passed data of the wrong type', () => {
      expect(isValidPrisonerId(123456)).toBeFalsy();
      expect(isValidPrisonerId([])).toBeFalsy();
      expect(isValidPrisonerId({})).toBeFalsy();
    });

    it('returns falsy when passed no data', () => {
      expect(isValidPrisonerId(null)).toBeFalsy();
      expect(isValidPrisonerId(undefined)).toBeFalsy();
    });
  });

  describe('isValidBookingId', () => {
    it('returns truthy when the number passed is 4 digits', () => {
      expect(isValidBookingId(4321)).toBeTruthy();
    });

    it('returns null when the number passed is not 4 digits', () => {
      expect(isValidBookingId(43213)).toBeFalsy();
    });

    it('returns null when passed data of the wrong type', () => {
      expect(isValidBookingId('1234')).toBeFalsy();
      expect(isValidBookingId([])).toBeFalsy();
      expect(isValidBookingId({})).toBeFalsy();
    });

    it('returns null when passed no data', () => {
      expect(isValidBookingId(null)).toBeFalsy();
      expect(isValidBookingId(undefined)).toBeFalsy();
    });
  });

  describe('isValidAccountCode', () => {
    it('returns truthy when the string is a supported account code', () => {
      expect(isValidAccountCode('spends')).toBeTruthy();
      expect(isValidAccountCode('cash')).toBeTruthy();
      expect(isValidAccountCode('savings')).toBeTruthy();
    });

    it('returns null when the account code is invalid', () => {
      expect(isValidAccountCode('potato')).toBeFalsy();
    });
    it('returns null when passed data of the wrong type', () => {
      expect(isValidAccountCode(123)).toBeFalsy();
      expect(isValidAccountCode([])).toBeFalsy();
      expect(isValidAccountCode({})).toBeFalsy();
    });

    it('returns null when passed no data', () => {
      expect(isValidAccountCode(null)).toBeFalsy();
      expect(isValidAccountCode(undefined)).toBeFalsy();
    });
  });

  describe('isValidDate', () => {
    it('returns truthy when a Date object is passed', () => {
      expect(isValidDate(new Date())).toBeTruthy();
    });

    it('returns null when passed data of the wrong type', () => {
      expect(isValidDate('2021-01-01')).toBeFalsy();
    });

    it('returns null when passed no data', () => {
      expect(isValidDate(null)).toBeFalsy();
      expect(isValidDate(undefined)).toBeFalsy();
    });
  });

  describe('isValidPrisonId', () => {
    it('returns truthy when the string passed matches the format ABC', () => {
      expect(isValidPrisonId('ABC')).toBeTruthy();
    });

    it('returns null when the string passed is not in the correct format', () => {
      expect(isValidPrisonId('ABCD')).toBeFalsy();
      expect(isValidPrisonId('AB£')).toBeFalsy();
    });

    it('returns null when passed data of the wrong type', () => {
      expect(isValidPrisonId(123)).toBeFalsy();
      expect(isValidPrisonId([])).toBeFalsy();
      expect(isValidPrisonId({})).toBeFalsy();
    });

    it('returns null when passed no data', () => {
      expect(isValidPrisonId(null)).toBeFalsy();
      expect(isValidPrisonId(undefined)).toBeFalsy();
    });
  });
});
