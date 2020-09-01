const { parseISO, format, isValid, isBefore, addDays } = require('date-fns');
const { prop } = require('ramda');
const { capitalize } = require('../../utils');
const { IEPSummary } = require('./responses/iep');
const { Balances } = require('./responses/balances');
const { Offender } = require('./responses/offender');
const { KeyWorker } = require('./responses/keyWorker');
const { NextVisit } = require('./responses/nextVisit');
const { ImportantDates } = require('./responses/importantDates');
const { TimeTable } = require('./responses/timeTable');

const prettyTime = date => {
  if (!isValid(new Date(date))) return '';
  return format(parseISO(date), 'h:mmaaa');
};

const createOffenderService = repository => {
  async function getOffenderDetailsFor(prisonerId) {
    const response = await repository.getOffenderDetailsFor(prisonerId);
    return Offender.from(response).format();
  }

  async function getIEPSummaryFor(bookingId) {
    try {
      const response = await repository.getIEPSummaryFor(bookingId);
      return IEPSummary.from(response).format();
    } catch {
      return {
        error: 'We are not able to show your IEP summary at this time',
      };
    }
  }

  async function getBalancesFor(bookingId) {
    try {
      const response = await repository.getBalancesFor(bookingId);
      return Balances.from(response).format();
    } catch {
      return {
        error: 'We are not able to show your balances at this time',
      };
    }
  }

  async function getKeyWorkerFor(prisonerId) {
    try {
      const response = await repository.getKeyWorkerFor(prisonerId);
      return KeyWorker.from(response).format();
    } catch {
      return {
        error: 'We are not able to show Key Worker information at this time',
      };
    }
  }

  async function getVisitsFor(bookingId) {
    try {
      const response = await repository.getNextVisitFor(bookingId);
      return NextVisit.from(response).format();
    } catch {
      return {
        error: 'We are not able to show your visits at this time',
      };
    }
  }

  async function getImportantDatesFor(bookingId) {
    try {
      const response = await repository.sentenceDetailsFor(bookingId);
      return ImportantDates.from(response).format();
    } catch {
      return {
        error: 'We are not able to show your important dates at this time',
      };
    }
  }

  // Move to the repository Tier?
  async function getActualHomeEvents(bookingId, time) {
    const hour = Number.parseInt(format(time, 'H'), 10);
    const tomorrowCutOffHour = 19;

    if (hour >= tomorrowCutOffHour) {
      const tomorrow = addDays(time, 1);
      const startDate = format(time, 'yyyy-MM-dd');
      const endDate = format(tomorrow, 'yyyy-MM-dd');

      return {
        events: await repository.getEventsFor(bookingId, startDate, endDate),
        isTomorrow: true,
      };
    }

    return {
      events: await repository.getEventsForToday(bookingId),
      isTomorrow: false,
    };
  }

  /*
   * Note this actually gets tomorrow's events if it's after 7pm as per this requirement:
   * https://trello.com/c/m5yt4sgm
   */
  async function getEventsForToday(bookingId, time = new Date()) {
    try {
      if (!bookingId) return [];

      const { events, isTomorrow } = await getActualHomeEvents(bookingId, time);

      return !Array.isArray(events)
        ? { todaysEvents: [], isTomorrow: false }
        : {
            todaysEvents: events
              .filter(
                event =>
                  event.eventType === 'APP' || event.eventType === 'VISIT',
              )
              .map(event => {
                const startTime = prettyTime(prop('startTime', event));
                const endTime = prettyTime(prop('endTime', event));

                return {
                  title: event.eventSourceDesc,
                  startTime,
                  endTime,
                  location: capitalize(event.eventLocation),
                  timeString: startTime,
                };
              }),
            isTomorrow,
          };
    } catch {
      return {
        error: 'We are not able to show your schedule for today at this time',
      };
    }
  }

  async function getEventsFor(bookingId, startDate, endDate) {
    try {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (!isValid(startDateObj) || !isValid(endDateObj)) {
        throw new Error('Invalid dates supplied');
      }

      if (!isBefore(startDateObj, endDateObj)) {
        throw new Error('Start date is after end date');
      }

      const eventsData = await repository.getEventsFor(
        bookingId,
        startDate,
        endDate,
      );

      if (!Array.isArray(eventsData)) {
        throw new Error('Invalid data returned from API');
      }

      return TimeTable.forRange(startDate, endDate)
        .addEvents(eventsData)
        .setEventStatesForToday()
        .build();
    } catch {
      return {
        error: `We are not able to show your schedule for the selected week at this time`,
      };
    }
  }

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getVisitsFor,
    getImportantDatesFor,
    getEventsForToday,
    getEventsFor,
  };
};

module.exports = {
  createPrisonApiOffenderService: createOffenderService,
};
