const { IncentivesSummary } = require('../incentives');
const {
  placeholders: { DEFAULT },
} = require('../../../../utils/enums');

const TEST_INCENTIVES_LEVEL = 'STANDARD';

describe('incentivesSummary', () => {
  it('Should handle an empty response', () => {
    const incentivesSummary = IncentivesSummary.from();

    expect(incentivesSummary.incentivesLevel).not.toBeDefined();
    expect(incentivesSummary.lastIncentivesReviewDate).not.toBeDefined();
    expect(incentivesSummary.nextIncentivesReviewDate).not.toBeDefined();

    const formatted = incentivesSummary.format();

    expect(formatted.incentivesLevel).toBe(DEFAULT);
    expect(formatted.daysSinceReview).toBe(DEFAULT);
    expect(formatted.reviewDate).toBe(DEFAULT);
  });

  it('should handle an incomplete response', () => {
    jest.useFakeTimers('modern').setSystemTime(1559343600000); // 01 Jun 2019 00:00

    let response = {
      iepLevel: TEST_INCENTIVES_LEVEL,
    };

    let formatted = IncentivesSummary.from(response).format();

    expect(formatted).toStrictEqual({
      incentivesLevel: TEST_INCENTIVES_LEVEL,
      daysSinceReview: DEFAULT,
      reviewDate: DEFAULT,
    });

    response = {
      iepDate: '2019-06-17T06:00:00.000Z',
    };

    formatted = IncentivesSummary.from(response).format();

    expect(formatted).toStrictEqual({
      incentivesLevel: DEFAULT,
      daysSinceReview: '16 days',
      reviewDate: 'Tuesday 17 September 2019',
    });
  });

  it('should format data when passed', () => {
    jest.useFakeTimers('modern').setSystemTime(1559343600000); // 01 Jun 2019 00:00

    const response = {
      iepLevel: TEST_INCENTIVES_LEVEL,
      iepDate: '2019-06-17T06:00:00.000Z',
    };

    const formatted = IncentivesSummary.from(response).format();

    expect(formatted).toStrictEqual({
      incentivesLevel: TEST_INCENTIVES_LEVEL,
      daysSinceReview: '16 days',
      reviewDate: 'Tuesday 17 September 2019',
    });
  });
});
