const { addMonths, format, formatDistance, parseISO } = require('date-fns');

const MONTHS_UNTIL_IEP_REVIEW = 3;
const DEFAULT = 'Unavailable';

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
        ? format(this.nextIepReviewDate, 'EEEE d MMMM')
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
