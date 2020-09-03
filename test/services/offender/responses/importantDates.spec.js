const {
  ImportantDates,
} = require('../../../../server/services/offender/responses/importantDates');
const {
  placeholders: { DEFAULT },
} = require('../../../../server/utils/enums');

describe('ImportantDates', () => {
  it('Should handle an empty response', () => {
    const importantDates = ImportantDates.from();

    expect(importantDates.hdcEligibilityDate).to.not.exist;
    expect(importantDates.conditionalReleaseDate).to.not.exist;
    expect(importantDates.licenceExpiryDate).to.not.exist;

    const formatted = importantDates.format();

    expect(formatted).to.eql({
      reCategorisationDate: DEFAULT,
      hdcEligibilityDate: DEFAULT,
      conditionalReleaseDate: DEFAULT,
      licenceExpiryDate: DEFAULT,
    });
  });

  it('should handle an incomplete response', () => {
    const response = {
      homeDetentionCurfewEligibilityDate: '2019-12-07T11:30:30',
      conditionalReleaseDate: '2019-12-07T11:30:30',
    };

    const formatted = ImportantDates.from(response).format();

    expect(formatted).to.eql(
      {
        reCategorisationDate: DEFAULT,
        hdcEligibilityDate: 'Saturday 07 December 2019',
        conditionalReleaseDate: 'Saturday 07 December 2019',
        licenceExpiryDate: DEFAULT,
      },
      'Should handle missing visitor name or type',
    );
  });

  it('should format data when passed', () => {
    const response = {
      homeDetentionCurfewEligibilityDate: '2019-12-07T11:30:30',
      conditionalReleaseDate: '2019-12-07T11:30:30',
      licenceExpiryDate: '2019-12-07T11:30:30',
    };

    const formatted = ImportantDates.from(response).format();

    expect(formatted).to.eql({
      reCategorisationDate: DEFAULT,
      hdcEligibilityDate: 'Saturday 07 December 2019',
      conditionalReleaseDate: 'Saturday 07 December 2019',
      licenceExpiryDate: 'Saturday 07 December 2019',
    });
  });
});
