const { parseISO, format, isValid } = require('date-fns');
// eslint-disable-next-line import/no-useless-path-segments
const { capitalizePersonName } = require('../../../../server/utils');

const DEFAULT = 'Unavailable';
const SCHEDULED_STATUS = 'SCH';
const PRETTY_DATE = 'EEEE dd MMMM yyyy';
const PRETTY_DAY = 'EEEE';
const PRETTY_DAY_AND_MONTH = 'd MMMM';

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
    if (this.status !== SCHEDULED_STATUS || !this.startTime) {
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
