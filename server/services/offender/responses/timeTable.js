const { format, isBefore, addDays, isValid, parseISO } = require('date-fns');
const { TimeTableEvent } = require('./timeTableEvent');

const getTimeTableRowTitle = date => {
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

    let startDate = new Date(options.startDate);
    let startDateString = format(startDate, 'yyyy-MM-dd');
    const endDate = new Date(options.endDate);
    const endDateString = format(endDate, 'yyyy-MM-dd');
    const todaysDate = new Date();

    while (startDateString !== endDateString) {
      startDateString = format(startDate, 'yyyy-MM-dd');

      this.events[startDateString] = TimeTable.createNewTableRow({
        title: getTimeTableRowTitle(startDateString),
        hasDateElapsed: isBefore(startDate, todaysDate),
      });

      startDate = addDays(startDate, 1);
    }
  }

  static forRange(startDate, endDate) {
    return new TimeTable({ startDate, endDate });
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

    this.events = events.reduce((timeTable, event) => {
      const eventDate = isoDate(event.startTime);
      const timeOfDay = getTimeOfDay(event.startTime);

      timeTable[eventDate][timeOfDay].events.push(
        TimeTableEvent.from(event).format(),
      );

      return timeTable;
    }, this.events);

    this.setEventStatesForToday();

    return this;
  }

  setEventStatesForToday() {
    const todaysDate = format(new Date(), 'yyyy-MM-dd');

    if (this.events[todaysDate]) {
      const todaysDateAndTime = format(new Date(), 'yyyy-MM-dd HH:mm');
      const currentTimeOfDay = getTimeOfDay(todaysDateAndTime);

      this.events[todaysDate].morning.finished = false;
      this.events[todaysDate].afternoon.finished = false;
      this.events[todaysDate].evening.finished = false;

      if (currentTimeOfDay === 'afternoon') {
        this.events[todaysDate].morning.finished = true;
      } else if (currentTimeOfDay === 'evening') {
        this.events[todaysDate].morning.finished = true;
        this.events[todaysDate].afternoon.finished = true;
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
