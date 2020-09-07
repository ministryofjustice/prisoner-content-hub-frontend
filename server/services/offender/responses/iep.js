const { addMonths, parseISO } = require('date-fns');
const {
  placeholders: { DEFAULT },
  dateFormats: { LONG_PRETTY_DATE },
} = require('../../../utils/enums');
const {
  formatDateOrDefault,
  formatTimeBetweenOrDefault,
} = require('../../../utils/date');

const MONTHS_UNTIL_IEP_REVIEW = 3;

class IEPSummary {
  constructor(options = {}) {
    const { iepLevel, lastIepReviewDate, nextIepReviewDate } = options;

    this.iepLevel = iepLevel;
    this.lastIepReviewDate = lastIepReviewDate;
    this.nextIepReviewDate = nextIepReviewDate;
  }

  format() {
    return {
      iepLevel: this.iepLevel || DEFAULT,
      reviewDate: formatDateOrDefault(
        DEFAULT,
        LONG_PRETTY_DATE,
        this.nextIepReviewDate,
      ),
      daysSinceReview: formatTimeBetweenOrDefault(
        DEFAULT,
        this.lastIepReviewDate,
      ),
    };
  }

  static from(response = {}) {
    const options = {
      iepLevel: response.iepLevel,
    };

    if (response.iepDate) {
      options.lastIepReviewDate = response.iepDate;
      options.nextIepReviewDate = addMonths(
        parseISO(options.lastIepReviewDate),
        MONTHS_UNTIL_IEP_REVIEW,
      ).toISOString();
    }

    return new IEPSummary(options);
  }
}

module.exports = {
  IEPSummary,
};
