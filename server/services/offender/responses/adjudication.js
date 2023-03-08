const {
  placeholders: { DEFAULT },
  dateFormats: { GDS_PRETTY_DATE_TIME },
} = require('../../../utils/enums');

const { formatDateOrDefault } = require('../../../utils/date');
const { formatName, formatHearing } = require('../../../utils/adjudication');

class Adjudication {
  constructor(result = {}) {
    const {
      adjudicationNumber,
      reportNumber,
      incidentTime,
      establishment,
      interiorLocation,
      reporterFirstName,
      reporterLastName,
      reportTime,
      incidentDetails,
      hearings,
    } = result;

    this.adjudicationNumber = adjudicationNumber;
    this.reportNumber = reportNumber;
    this.incidentTime = incidentTime;
    this.establishment = establishment;
    this.interiorLocation = interiorLocation;
    this.reporterFirstName = reporterFirstName;
    this.reporterLastName = reporterLastName;
    this.reportTime = reportTime;
    this.incidentDetails = incidentDetails;
    this.hearings = hearings;
  }

  format() {
    return {
      adjudicationNumber: this.adjudicationNumber,
      reportNumber: this.reportNumber,
      incidentDateTime: formatDateOrDefault(
        DEFAULT,
        GDS_PRETTY_DATE_TIME,
        this.incidentTime,
      ),
      location: `${this.interiorLocation}, ${this.establishment}`,
      reportedBy: formatName(this.reporterFirstName, this.reporterLastName),
      reportDateTime: formatDateOrDefault(
        DEFAULT,
        GDS_PRETTY_DATE_TIME,
        this.reportTime,
      ),
      incidentDetails: this.incidentDetails,
      hearings: this.hearings
        .sort((a, b) => a.hearingTime.localeCompare(b.hearingTime))
        .reverse()
        .map(formatHearing),
    };
  }

  static from(response = {}) {
    return new Adjudication(response);
  }
}

module.exports = {
  Adjudication,
};
