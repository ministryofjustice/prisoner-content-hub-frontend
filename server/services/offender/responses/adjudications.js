const {
  placeholders: { DEFAULT },
  dateFormats: { GDS_PRETTY_DATE_TIME },
} = require('../../../utils/enums');

const { formatDateOrDefault } = require('../../../utils/date');

const formatAdjudication = adjudication => ({
  adjudicationNumber: adjudication.adjudicationNumber || DEFAULT,
  reportTime: formatDateOrDefault(
    DEFAULT,
    GDS_PRETTY_DATE_TIME,
    adjudication.reportTime,
  ),
  numberOfCharges: adjudication.adjudicationCharges?.length || 0,
});

class Adjudications {
  constructor(options = {}) {
    const { results } = options;
    this.adjudications = results;
  }

  format() {
    return this.adjudications?.length > 0
      ? this.adjudications.map(formatAdjudication)
      : {};
  }

  static from(response = {}) {
    return new Adjudications(response);
  }
}

module.exports = {
  Adjudications,
};
