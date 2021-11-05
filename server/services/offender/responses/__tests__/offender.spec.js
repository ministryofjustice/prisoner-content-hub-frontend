const { Offender } = require('../offender');
const {
  placeholders: { DEFAULT },
} = require('../../../../utils/enums');

describe('Offender', () => {
  it('Should handle an empty response', () => {
    const offender = Offender.from();

    expect(offender.bookingId).not.toBeDefined();
    expect(offender.offenderNo).not.toBeDefined();
    expect(offender.firstName).not.toBeDefined();
    expect(offender.lastName).not.toBeDefined();

    const formatted = offender.format();

    expect(formatted.bookingId).not.toBeDefined();
    expect(formatted.offenderNo).not.toBeDefined();
    expect(formatted.name).toBe(DEFAULT);
  });

  it('should handle an incomplete response', () => {
    const response = {
      agencyId: 'FMI',
      bookingId: 1013376,
      dateOfBirth: '1947-04-01',
      offenderNo: 'G0653GG',
      firstName: 'DONALD',
    };

    const formatted = Offender.from(response).format();

    expect(formatted).toStrictEqual(
      {
        agencyId: 'FMI',
        bookingId: 1013376,
        dateOfBirth: '1947-04-01',
        offenderNo: 'G0653GG',
        name: 'Donald',
      },
      'Should handle a partial name',
    );
  });

  it('should format data when passed', () => {
    const response = {
      agencyId: 'FMI',
      bookingId: 1013376,
      dateOfBirth: '1970-04-01',
      offenderNo: 'G0653GG',
      firstName: 'DONALD',
      middleName: 'FAUNTLEROY',
      lastName: 'DUCK',
    };

    const formatted = Offender.from(response).format();

    expect(formatted).toStrictEqual({
      agencyId: 'FMI',
      bookingId: 1013376,
      dateOfBirth: '1970-04-01',
      offenderNo: 'G0653GG',
      name: 'Donald Duck',
    });
  });
});
