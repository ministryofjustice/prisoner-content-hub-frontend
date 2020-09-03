const { parseISO, format, isValid } = require('date-fns');
const {
  placeholders: { DEFAULT },
  dateFormats: { PRETTY_DATE },
} = require('../../../utils/enums');

const formatDateOr = (defaultValue = '', dateFormat, date) => {
  if (!isValid(new Date(date))) {
    return defaultValue;
  }
  return format(parseISO(date), dateFormat);
};

class ImportantDates {
  constructor(options = {}) {
    this.hdcEligibilityDate = options.hdcEligibilityDate;
    this.conditionalReleaseDate = options.conditionalReleaseDate;
    this.licenceExpiryDate = options.licenceExpiryDate;
  }

  format() {
    return {
      reCategorisationDate: DEFAULT,
      hdcEligibilityDate: formatDateOr(
        DEFAULT,
        PRETTY_DATE,
        this.hdcEligibilityDate,
      ),
      conditionalReleaseDate: formatDateOr(
        DEFAULT,
        PRETTY_DATE,
        this.conditionalReleaseDate,
      ),
      licenceExpiryDate: formatDateOr(
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
