const { addMonths, format, formatDistance, parseISO } = require('date-fns');
const {
  placeholders: { DEFAULT },
  dateFormats: { LONG_PRETTY_DATE },
} = require('../../../utils/enums');

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
      reviewDate: this.nextIepReviewDate
        ? format(this.nextIepReviewDate, LONG_PRETTY_DATE)
        : DEFAULT,
      daysSinceReview: this.lastIepReviewDate
        ? formatDistance(this.lastIepReviewDate, new Date())
        : DEFAULT,
    };
  }

  static from(response = {}) {
    const options = {
      iepLevel: response.iepLevel,
    };

    if (response.iepDate) {
      options.lastIepReviewDate = parseISO(response.iepDate);
      options.nextIepReviewDate = addMonths(
        options.lastIepReviewDate,
        MONTHS_UNTIL_IEP_REVIEW,
      );
    }

    return new IEPSummary(options);
  }
}

module.exports = {
  IEPSummary,
};
