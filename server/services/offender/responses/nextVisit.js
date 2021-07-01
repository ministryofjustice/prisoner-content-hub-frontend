const { capitalizePersonName } = require('../../../utils');
const {
  placeholders: { DEFAULT },
  dateFormats: {
    PRETTY_DAY,
    PRETTY_DAY_AND_MONTH,
    LONG_PRETTY_DATE,
    PRETTY_TIME,
  },
} = require('../../../utils/enums');
const { formatDateOrDefault } = require('../../../utils/date');

const visitTypeDisplayText = {
  OFFI: 'Official visit',
  SCON: 'Social visit',
};

class NextVisit {
  constructor(options = {}) {
    this.startTime = options.startTime;
    this.endTime = options.endTime;
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
      nextVisit: formatDateOrDefault(DEFAULT, LONG_PRETTY_DATE, this.startTime),
      nextVisitDay: formatDateOrDefault(DEFAULT, PRETTY_DAY, this.startTime),
      nextVisitDate: formatDateOrDefault(
        DEFAULT,
        PRETTY_DAY_AND_MONTH,
        this.startTime,
      ),
      visitorName: this.visitorName
        ? capitalizePersonName(this.visitorName)
        : DEFAULT,
      visitType: visitTypeDisplayText?.[this.visitType],
      startTime: formatDateOrDefault(DEFAULT, PRETTY_TIME, this.startTime),
      endTime: formatDateOrDefault(DEFAULT, PRETTY_TIME, this.endTime),
    };
  }

  static from(response = {}) {
    const {
      startTime,
      endTime,
      eventStatus,
      leadVisitor,
      visitTypeDescription,
    } = response;

    return new NextVisit({
      startTime,
      endTime,
      status: eventStatus,
      visitorName: leadVisitor,
      visitType: visitTypeDescription,
    });
  }
}

module.exports = {
  NextVisit,
};
