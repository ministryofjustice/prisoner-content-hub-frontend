const { parseISO, format, isValid } = require('date-fns');
const { capitalizePersonName } = require('../../../utils');
const {
  placeholders: { DEFAULT },
  timetable: { SCHEDULED_EVENT_TYPE },
  dateFormats: { PRETTY_DAY, PRETTY_DAY_AND_MONTH, PRETTY_DATE },
} = require('../../../utils/enums');

const formatDateOr = (defaultValue = '', dateFormat, date) => {
  if (!isValid(new Date(date))) {
    return defaultValue;
  }
  return format(parseISO(date), dateFormat);
};

class NextVisit {
  constructor(options = {}) {
    this.startTime = options.startTime;
    this.status = options.status;
    this.visitorName = options.visitorName;
    this.visitType = options.visitType;
  }

  format() {
    if (this.status !== SCHEDULED_EVENT_TYPE || !this.startTime) {
      return { error: 'No upcoming visit' };
    }

    return {
      nextVisit: formatDateOr(DEFAULT, PRETTY_DATE, this.startTime),
      nextVisitDay: formatDateOr(DEFAULT, PRETTY_DAY, this.startTime),
      nextVisitDate: formatDateOr(
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
    const {
      startTime,
      eventStatus,
      leadVisitor,
      visitTypeDescription,
    } = response;

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
