const {
  Offender,
} = require('../../../../server/services/offender/responses/offender');
const {
  placeholders: { DEFAULT },
} = require('../../../../server/utils/enums');

describe('Offender', () => {
  it('Should handle an empty response', () => {
    const offender = Offender.from();

    expect(offender.bookingId).to.not.exist;
    expect(offender.offenderNo).to.not.exist;
    expect(offender.firstName).to.not.exist;
    expect(offender.lastName).to.not.exist;

    const formatted = offender.format();

    expect(formatted.bookingId).to.not.exist;
    expect(formatted.offenderNo).to.not.exist;
    expect(formatted.name).to.equal(DEFAULT);
  });

  it('should handle an incomplete response', () => {
    const response = {
      bookingId: 1013376,
      offenderNo: 'G0653GG',
      firstName: 'DONALD',
    };

    const formatted = Offender.from(response).format();

    expect(formatted).to.eql(
      {
        bookingId: 1013376,
        offenderNo: 'G0653GG',
        name: 'Donald',
      },
      'Should handle a partial name',
    );
  });

  it('should format data when passed', () => {
    const response = {
      bookingId: 1013376,
      offenderNo: 'G0653GG',
      firstName: 'DONALD',
      middleName: 'FAUNTLEROY',
      lastName: 'DUCK',
    };

    const formatted = Offender.from(response).format();

    expect(formatted).to.eql({
      bookingId: 1013376,
      offenderNo: 'G0653GG',
      name: 'Donald Duck',
    });
  });
});
