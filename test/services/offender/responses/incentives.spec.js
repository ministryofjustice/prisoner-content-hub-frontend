const {
  IncentivesSummary,
} = require('../../../../server/services/offender/responses/incentives');
const {
  placeholders: { DEFAULT },
} = require('../../../../server/utils/enums');

const TEST_INCENTIVES_LEVEL = 'STANDARD';

describe('incentivesSummary', () => {
  it('Should handle an empty response', () => {
    const incentivesSummary = IncentivesSummary.from();

    expect(incentivesSummary.incentivesLevel).to.not.exist;
    expect(incentivesSummary.lastIncentivesReviewDate).to.not.exist;
    expect(incentivesSummary.nextIncentivesReviewDate).to.not.exist;

    const formatted = incentivesSummary.format();

    expect(formatted.incentivesLevel).to.equal(DEFAULT);
    expect(formatted.daysSinceReview).to.equal(DEFAULT);
    expect(formatted.reviewDate).to.equal(DEFAULT);
  });

  it('should handle an incomplete response', () => {
    const clock = sinon.useFakeTimers({
      now: 1559343600000, // 01 Jun 2019 00:00
    });

    let response = {
      iepLevel: TEST_INCENTIVES_LEVEL,
    };

    let formatted = IncentivesSummary.from(response).format();

    expect(formatted).to.eql({
      incentivesLevel: TEST_INCENTIVES_LEVEL,
      daysSinceReview: DEFAULT,
      reviewDate: DEFAULT,
    });

    response = {
      iepDate: '2019-06-17T06:00:00.000Z',
    };

    formatted = IncentivesSummary.from(response).format();

    expect(formatted).to.eql({
      incentivesLevel: DEFAULT,
      daysSinceReview: '16 days',
      reviewDate: 'Tuesday 17 September',
    });

    clock.restore();
  });

  it('should format data when passed', () => {
    const clock = sinon.useFakeTimers({
      now: 1559343600000, // 01 Jun 2019 00:00
    });

    const response = {
      iepLevel: TEST_INCENTIVES_LEVEL,
      iepDate: '2019-06-17T06:00:00.000Z',
    };

    const formatted = IncentivesSummary.from(response).format();

    expect(formatted).to.eql({
      incentivesLevel: TEST_INCENTIVES_LEVEL,
      daysSinceReview: '16 days',
      reviewDate: 'Tuesday 17 September',
    });

    clock.restore();
  });
});
