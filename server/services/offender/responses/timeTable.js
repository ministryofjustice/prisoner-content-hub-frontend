const { format, isBefore, addDays, isValid, parseISO } = require('date-fns');
const { capitalize } = require('../../../utils');

const getTimetableTitle = date => {
  const givenDate = new Date(date);

  if (!isValid(givenDate)) return '';

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const todayDateString = format(today, 'EEEE d MMMM');
  const tomorrowDateString = format(tomorrow, 'EEEE d MMMM');
  const givenDateString = format(givenDate, 'EEEE d MMMM');

  if (givenDateString === todayDateString) {
    return 'Today';
  }

  if (givenDateString === tomorrowDateString) {
    return 'Tomorrow';
  }

  return givenDateString;
};

const getTimetableEventTime = (startTime, endTime) => {
  if (startTime === '') {
    return '';
  }

  if (endTime !== '') {
    return `${startTime} to ${endTime}`;
  }

  return startTime;
};

const prettyTime = date => {
  if (!isValid(new Date(date))) return '';
  return format(parseISO(date), 'h:mmaaa');
};

const isoDate = date => {
  if (!isValid(new Date(date))) return '';
  return format(parseISO(date), 'yyyy-MM-dd');
};

const getTimeOfDay = date => {
  const dateObject = new Date(date);
  if (!isValid(dateObject)) return '';

  const dateString = isoDate(date);

  if (isBefore(dateObject, parseISO(`${dateString} 12:00:00`))) {
    return 'morning';
  }

  if (isBefore(dateObject, parseISO(`${dateString} 17:00:00`))) {
    return 'afternoon';
  }

  return 'evening';
};

class TimeTable {
  constructor(options = {}) {
    this.events = {};
    this.startDate = options.startDate;
    this.endDate = options.endDate;

    let checkDateObj = new Date(this.startDate);
    let checkDateStr = format(checkDateObj, 'yyyy-MM-dd');
    const endDateObj = new Date(this.endDate);
    const endDateStr = format(endDateObj, 'yyyy-MM-dd');
    const todayObj = new Date();

    while (checkDateStr !== endDateStr) {
      checkDateStr = format(checkDateObj, 'yyyy-MM-dd');

      const finished = isBefore(checkDateObj, todayObj);

      this.events[checkDateStr] = {
        morning: {
          finished,
          events: [],
        },
        afternoon: {
          finished,
          events: [],
        },
        evening: {
          finished,
          events: [],
        },
        title: getTimetableTitle(checkDateStr),
      };

      checkDateObj = addDays(checkDateObj, 1);
    }
  }

  static forRange(startDate, endDate) {
    return new TimeTable({ startDate, endDate });
  }

  addEvent(event = {}) {
    const startTime = prettyTime(event.startTime);
    const endTime = prettyTime(event.endTime);
    const dateString = isoDate(event.startTime);
    const timeOfDay = getTimeOfDay(event.startTime);

    this.events[dateString][timeOfDay].events.push({
      description: event.eventSourceDesc,
      startTime,
      endTime,
      location: capitalize(event.eventLocation),
      timeString: getTimetableEventTime(startTime, endTime),
      eventType: event.eventType,
      finished: event.eventStatus !== 'SCH',
      status: event.eventStatus,
      paid: event.paid,
    });

    if (event.eventStatus === 'SCH') {
      this.events[dateString][timeOfDay].finished = false;
    }
  }

  setEventStatesForToday() {
    const nowDateString = format(new Date(), 'yyyy-MM-dd');

    if (this.events[nowDateString]) {
      const nowString = format(new Date(), 'yyyy-MM-dd HH:mm');
      const currentTimeOfDay = getTimeOfDay(nowString);

      this.events[nowDateString].morning.finished = false;
      this.events[nowDateString].afternoon.finished = false;
      this.events[nowDateString].evening.finished = false;

      if (currentTimeOfDay === 'afternoon') {
        this.events[nowDateString].morning.finished = true;
      } else if (currentTimeOfDay === 'evening') {
        this.events[nowDateString].morning.finished = true;
        this.events[nowDateString].afternoon.finished = true;
      }
    }

    return this;
  }

  build() {
    return this.events;
  }
}

module.exports = {
  TimeTable,
};
