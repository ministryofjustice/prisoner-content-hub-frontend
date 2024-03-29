const {
  placeholders: { DEFAULT },
  dateFormats: { PRETTY_DATE },
} = require('../../../utils/enums');
const { formatDateOrDefault } = require('../../../utils/date');

class ImportantDates {
  constructor(options = {}) {
    this.hdcEligibilityDate = options.hdcEligibilityDate;
    this.conditionalReleaseDate = options.conditionalReleaseDate;
    this.licenceExpiryDate = options.licenceExpiryDate;
  }

  format() {
    return {
      reCategorisationDate: DEFAULT,
      hdcEligibilityDate: formatDateOrDefault(
        DEFAULT,
        PRETTY_DATE,
        this.hdcEligibilityDate,
      ),
      conditionalReleaseDate: formatDateOrDefault(
        DEFAULT,
        PRETTY_DATE,
        this.conditionalReleaseDate,
      ),
      licenceExpiryDate: formatDateOrDefault(
        DEFAULT,
        PRETTY_DATE,
        this.licenceExpiryDate,
      ),
    };
  }

  static from(response = {}) {
    const {
      homeDetentionCurfewEligibilityDate,
      conditionalReleaseDate,
      licenceExpiryDate,
    } = response;

    return new ImportantDates({
      hdcEligibilityDate: homeDetentionCurfewEligibilityDate,
      conditionalReleaseDate,
      licenceExpiryDate,
    });
  }
}

module.exports = {
  ImportantDates,
};
