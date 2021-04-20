const { addMonths, parseISO } = require('date-fns');
const {
  placeholders: { DEFAULT },
  dateFormats: { PRETTY_DATE },
} = require('../../../utils/enums');
const {
  formatDateOrDefault,
  formatTimeBetweenOrDefault,
} = require('../../../utils/date');

const MONTHS_UNTIL_INCENTIVES_REVIEW = 3;

class IncentivesSummary {
  constructor(options = {}) {
    const {
      incentivesLevel,
      lastIncentivesReviewDate,
      nextIncentivesReviewDate,
    } = options;

    this.incentivesLevel = incentivesLevel;
    this.lastIncentivesReviewDate = lastIncentivesReviewDate;
    this.nextIncentivesReviewDate = nextIncentivesReviewDate;
  }

  format() {
    return {
      incentivesLevel: this.incentivesLevel || DEFAULT,
      reviewDate: formatDateOrDefault(
        DEFAULT,
        PRETTY_DATE,
        this.nextIncentivesReviewDate,
      ),
      daysSinceReview: formatTimeBetweenOrDefault(
        DEFAULT,
        this.lastIncentivesReviewDate,
      ),
    };
  }

  static from(response = {}) {
    const options = {
      incentivesLevel: response.iepLevel,
    };

    if (response.iepDate) {
      options.lastIncentivesReviewDate = response.iepDate;
      options.nextIncentivesReviewDate = addMonths(
        parseISO(options.lastIncentivesReviewDate),
        MONTHS_UNTIL_INCENTIVES_REVIEW,
      ).toISOString();
    }

    return new IncentivesSummary(options);
  }
}

module.exports = {
  IncentivesSummary,
};
