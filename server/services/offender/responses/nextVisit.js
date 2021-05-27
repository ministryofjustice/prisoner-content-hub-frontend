const { capitalizePersonName } = require('../../../utils');
const {
  placeholders: { DEFAULT },
  dateFormats: { PRETTY_DAY, PRETTY_DAY_AND_MONTH, PRETTY_DATE },
} = require('../../../utils/enums');
const { formatDateOrDefault } = require('../../../utils/date');

class NextVisit {
  constructor(options = {}) {
    this.startTime = options.startTime;
    this.status = options.status;
    this.visitorName = options.visitorName;
    this.visitType = options.visitType;
  }

  hasNextVisit() {
    return this.startTime != null;
  }

  format() {
    return {
      hasNextVisit: this.hasNextVisit(),
      nextVisit: formatDateOrDefault(DEFAULT, PRETTY_DATE, this.startTime),
      nextVisitDay: formatDateOrDefault(DEFAULT, PRETTY_DAY, this.startTime),
      nextVisitDate: formatDateOrDefault(
        DEFAULT,
        PRETTY_DAY_AND_MONTH,
        this.startTime,
      ),
      visitorName: this.visitorName
        ? capitalizePersonName(this.visitorName)
        : DEFAULT,
      visitType: this.visitType ? this.visitType.split(' ').shift() : DEFAULT,
    };
  }

  static from(response = {}) {
    const { startTime, eventStatus, leadVisitor, visitTypeDescription } =
      response;

    return new NextVisit({
      startTime,
      status: eventStatus,
      visitorName: leadVisitor,
      visitType: visitTypeDescription,
    });
  }
}

module.exports = {
  NextVisit,
};
