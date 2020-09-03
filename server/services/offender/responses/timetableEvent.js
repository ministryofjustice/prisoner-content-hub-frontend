const { parseISO, format, isValid } = require('date-fns');
const { capitalize } = require('../../../utils');

const DEFAULT = 'Unavailable';
const SCHEDULED_STATUS = 'SCH';
const PRETTY_TIME = 'h:mmaaa';

const getTimetableEventTime = (startTime, endTime) => {
  if (startTime === '') {
    return '';
  }

  if (endTime !== '') {
    return `${startTime} to ${endTime}`;
  }

  return startTime;
};

const formatDateOr = (defaultValue = '', dateFormat, date) => {
  if (!isValid(new Date(date))) {
    return defaultValue;
  }
  return format(parseISO(date), dateFormat);
};

class TimetableEvent {
  constructor(options = {}) {
    this.description = options.description;
    this.startTime = options.startTime;
    this.endTime = options.endTime;
    this.location = options.location;
    this.eventType = options.eventType;
    this.status = options.status;
    this.paid = options.paid;
  }

  format() {
    return {
      description: this.description || DEFAULT,
      startTime: formatDateOr('', PRETTY_TIME, this.startTime),
      endTime: formatDateOr('', PRETTY_TIME, this.endTime),
      location: this.location ? capitalize(this.location) : DEFAULT,
      timeString: getTimetableEventTime(
        formatDateOr('', PRETTY_TIME, this.startTime),
        formatDateOr('', PRETTY_TIME, this.endTime),
      ),
      eventType: this.eventType || DEFAULT,
      finished: this.status !== SCHEDULED_STATUS,
      status: this.status || DEFAULT,
      paid: this.paid,
    };
  }

  static from(response = {}) {
    const {
      startTime,
      endTime,
      eventSourceDesc,
      eventLocation,
      eventType,
      eventStatus,
      paid,
    } = response;

    return new TimetableEvent({
      description: eventSourceDesc,
      startTime,
      endTime,
      location: eventLocation,
      eventType,
      status: eventStatus,
      paid,
    });
  }
}

module.exports = {
  TimetableEvent,
};
