const {
  IEPSummary,
} = require('../../../../server/services/offender/responses/iep');
const {
  placeholders: { DEFAULT },
} = require('../../../../server/utils/enums');

const TEST_IEP_LEVEL = 'STANDARD';

describe('IEPSummary', () => {
  it('Should handle an empty response', () => {
    const iepSummary = IEPSummary.from();

    expect(iepSummary.iepLevel).to.not.exist;
    expect(iepSummary.lastIepReviewDate).to.not.exist;
    expect(iepSummary.lastIepReviewDate).to.not.exist;

    const formatted = iepSummary.format();

    expect(formatted.iepLevel).to.equal(DEFAULT);
    expect(formatted.daysSinceReview).to.equal(DEFAULT);
    expect(formatted.reviewDate).to.equal(DEFAULT);
  });

  it('should handle an incomplete response', () => {
    const clock = sinon.useFakeTimers({
      now: 1559343600000, // 01 Jun 2019 00:00
    });

    let response = {
      iepLevel: TEST_IEP_LEVEL,
    };

    let formatted = IEPSummary.from(response).format();

    expect(formatted).to.eql({
      iepLevel: TEST_IEP_LEVEL,
      daysSinceReview: DEFAULT,
      reviewDate: DEFAULT,
    });

    response = {
      iepDate: '2019-06-17T06:00:00.000Z',
    };

    formatted = IEPSummary.from(response).format();

    expect(formatted).to.eql({
      iepLevel: DEFAULT,
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
      iepLevel: TEST_IEP_LEVEL,
      iepDate: '2019-06-17T06:00:00.000Z',
    };

    const formatted = IEPSummary.from(response).format();

    expect(formatted).to.eql({
      iepLevel: TEST_IEP_LEVEL,
      daysSinceReview: '16 days',
      reviewDate: 'Tuesday 17 September',
    });

    clock.restore();
  });
});
