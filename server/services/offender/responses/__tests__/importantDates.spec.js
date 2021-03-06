const { ImportantDates } = require('../importantDates');
const {
  placeholders: { DEFAULT },
} = require('../../../../utils/enums');

describe('ImportantDates', () => {
  it('Should handle an empty response', () => {
    const importantDates = ImportantDates.from();

    expect(importantDates.hdcEligibilityDate).not.toBeDefined();
    expect(importantDates.conditionalReleaseDate).not.toBeDefined();
    expect(importantDates.licenceExpiryDate).not.toBeDefined();

    const formatted = importantDates.format();

    expect(formatted).toStrictEqual({
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

    expect(formatted).toStrictEqual(
      {
        reCategorisationDate: DEFAULT,
        hdcEligibilityDate: 'Saturday 7 December 2019',
        conditionalReleaseDate: 'Saturday 7 December 2019',
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

    expect(formatted).toStrictEqual({
      reCategorisationDate: DEFAULT,
      hdcEligibilityDate: 'Saturday 7 December 2019',
      conditionalReleaseDate: 'Saturday 7 December 2019',
      licenceExpiryDate: 'Saturday 7 December 2019',
    });
  });
});
