const { capitalize } = require('../../../utils');
const {
  placeholders: { DEFAULT },
  timetable: { SCHEDULED_EVENT_TYPE },
  dateFormats: { PRETTY_TIME },
} = require('../../../utils/enums');
const { formatDateOrDefault } = require('../../../utils/date');

const getTimetableEventTime = (startTime, endTime) => {
  if (startTime === '') {
    return '';
  }

  if (endTime !== '') {
    return `${startTime} to ${endTime}`;
  }

  return startTime;
};

class TimetableEvent {
  constructor(options = {}) {
    this.description = options.description;
    this.startTime = options.startTime;
    this.endTime = options.endTime;
    this.location = options.location;
    this.type = options.type;
    this.status = options.status;
    this.paid = options.paid;
  }

  format() {
    return {
      description: this.description || DEFAULT,
      startTime: formatDateOrDefault('', PRETTY_TIME, this.startTime),
      endTime: formatDateOrDefault('', PRETTY_TIME, this.endTime),
      location: this.location ? capitalize(this.location) : DEFAULT,
      timeString: getTimetableEventTime(
        formatDateOrDefault('', PRETTY_TIME, this.startTime),
        formatDateOrDefault('', PRETTY_TIME, this.endTime),
      ),
      eventType: this.type || DEFAULT,
      finished: this.status !== SCHEDULED_EVENT_TYPE,
      status: this.status || DEFAULT,
      paid: this.paid,
    };
  }

  static filterByType(...types) {
    return timetableEvent => types.includes(timetableEvent.type);
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
      type: eventType,
      status: eventStatus,
      paid,
    });
  }
}

module.exports = {
  TimetableEvent,
};
