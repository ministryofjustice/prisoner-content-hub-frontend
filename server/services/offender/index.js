const { format, isValid, isBefore, addDays } = require('date-fns');
const responses = require('./responses');

const createOffenderService = (
  repository,
  {
    Offender,
    IEPSummary,
    Balances,
    KeyWorker,
    NextVisit,
    ImportantDates,
    Timetable,
    TimetableEvent,
  } = responses,
) => {
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

  // Move to the repository Tier ?
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
              .filter(TimetableEvent.filterByType('APP', 'VISIT'))
              .map(eventResponse =>
                TimetableEvent.from(eventResponse).format(),
              ),
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

      return Timetable.create({ startDate, endDate })
        .addEvents(eventsData)
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
