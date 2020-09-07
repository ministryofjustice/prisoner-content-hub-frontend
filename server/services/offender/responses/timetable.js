const { format, isBefore, addDays, isValid, parseISO } = require('date-fns');
const { TimetableEvent } = require('./timetableEvent');
const {
  dateFormats: { LONG_PRETTY_DATE, ISO_DATE, ISO_DATE_TIME },
  timetable: { MORNING, AFTERNOON, EVENING },
} = require('../../../utils/enums');

const isoDate = date => {
  if (!isValid(new Date(date))) return '';
  return format(parseISO(date), ISO_DATE);
};

const getTimeOfDay = date => {
  const dateObject = new Date(date);
  if (!isValid(dateObject)) return '';

  const dateString = isoDate(date);

  if (isBefore(dateObject, parseISO(`${dateString} 12:00:00`))) {
    return MORNING;
  }

  if (isBefore(dateObject, parseISO(`${dateString} 17:00:00`))) {
    return AFTERNOON;
  }

  return EVENING;
};

class Timetable {
  constructor(options = {}) {
    this.events = {};

    let startDate = new Date(options.startDate);
    let startDateString = format(startDate, ISO_DATE);
    const endDate = new Date(options.endDate);
    const endDateString = format(endDate, ISO_DATE);
    const todaysDate = new Date();

    do {
      startDateString = format(startDate, ISO_DATE);

      this.events[startDateString] = Timetable.createNewTableRow({
        title: Timetable.getTimetableRowTitle(startDateString),
        hasDateElapsed: isBefore(startDate, todaysDate),
      });

      startDate = addDays(startDate, 1);
    } while (startDateString !== endDateString);
  }

  static create(options = {}) {
    const { startDate, endDate } = options;
    return new Timetable({ startDate, endDate: endDate || startDate });
  }

  static getTimetableRowTitle(date) {
    const givenDate = new Date(date);

    if (!isValid(givenDate)) return '';

    const today = new Date();
    const tomorrow = addDays(today, 1);
    const todayDateString = format(today, LONG_PRETTY_DATE);
    const tomorrowDateString = format(tomorrow, LONG_PRETTY_DATE);
    const givenDateString = format(givenDate, LONG_PRETTY_DATE);

    if (givenDateString === todayDateString) {
      return 'Today';
    }

    if (givenDateString === tomorrowDateString) {
      return 'Tomorrow';
    }

    return givenDateString;
  }

  static createNewTableRow({ title, hasDateElapsed }) {
    return {
      morning: {
        finished: hasDateElapsed,
        events: [],
      },
      afternoon: {
        finished: hasDateElapsed,
        events: [],
      },
      evening: {
        finished: hasDateElapsed,
        events: [],
      },
      title,
    };
  }

  addEvents(events = []) {
    if (!Array.isArray(events)) {
      throw new Error('Events must be an array');
    }

    this.events = events.reduce((timetable, event) => {
      const eventDate = isoDate(event.startTime);
      const timeOfDay = getTimeOfDay(event.startTime);

      timetable[eventDate][timeOfDay].events.push(
        TimetableEvent.from(event).format(),
      );

      return timetable;
    }, this.events);

    this.setEventStatesForToday();

    return this;
  }

  setEventStatesForToday() {
    const todaysDate = format(new Date(), ISO_DATE);

    if (this.events[todaysDate]) {
      const todaysDateAndTime = format(new Date(), ISO_DATE_TIME);
      const currentTimeOfDay = getTimeOfDay(todaysDateAndTime);

      this.events[todaysDate][MORNING].finished = false;
      this.events[todaysDate][AFTERNOON].finished = false;
      this.events[todaysDate][EVENING].finished = false;

      if (currentTimeOfDay === AFTERNOON) {
        this.events[todaysDate][MORNING].finished = true;
      } else if (currentTimeOfDay === EVENING) {
        this.events[todaysDate][MORNING].finished = true;
        this.events[todaysDate][AFTERNOON].finished = true;
      }
    }

    return this;
  }

  build() {
    return this.events;
  }
}

module.exports = {
  Timetable,
};
