const { format, isValid, isBefore, addDays } = require('date-fns');
const responses = require('./responses');
const {
  dateFormats: { ISO_DATE, HOUR },
} = require('../../utils/enums');
const { logger } = require('../../utils/logger');

const createOffenderService = (
  repository,
  {
    Offender,
    IncentivesSummary,
    Balances,
    KeyWorker,
    nextVisit,
    approvedVisitors,
    ImportantDates,
    Timetable,
    TimetableEvent,
  } = responses,
) => {
  async function getOffenderDetailsFor({ prisonerId }) {
    logger.info(
      `OffenderService (getOffenderDetailsFor) - User: ${prisonerId}`,
    );
    const response = await repository.getOffenderDetailsFor(prisonerId);
    return Offender.from(response).format();
  }

  async function getIncentivesSummaryFor({ prisonerId, bookingId }) {
    try {
      logger.info(
        `OffenderService (getIncentivesSummaryFor) - User: ${prisonerId}`,
      );

      const response = await repository.getIncentivesSummaryFor(bookingId);
      return IncentivesSummary.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getIncentivesSummaryFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: true,
      };
    }
  }

  async function getBalancesFor({ prisonerId, bookingId }) {
    try {
      logger.info(`OffenderService (getBalancesFor) - User: ${prisonerId}`);

      const response = await repository.getBalancesFor(bookingId);
      return Balances.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getBalancesFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: true,
      };
    }
  }

  async function getKeyWorkerFor({ prisonerId }) {
    try {
      logger.info(`OffenderService (getKeyWorkerFor) - User: ${prisonerId}`);

      const response = await repository.getKeyWorkerFor(prisonerId);
      return KeyWorker.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getKeyWorkerFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show Key Worker information at this time',
      };
    }
  }

  async function getVisitorsFor({ prisonerId, bookingId }) {
    try {
      logger.info(`OffenderService (getVisitorsFor) - User: ${prisonerId}`);
      const response = await repository.getVisitorsFor(bookingId);
      return approvedVisitors(response);
    } catch (e) {
      logger.error(
        `OffenderService (getVisitorsFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: true,
      };
    }
  }

  async function getVisitsFor({ prisonerId, bookingId }) {
    try {
      logger.info(`OffenderService (getVisitsFor) - User: ${prisonerId}`);

      const today = new Date();
      const startDate = format(today, 'yyyy-MM-dd');
      const response = await repository.getNextVisitFor(bookingId, startDate);
      return nextVisit(response?.content);
    } catch (e) {
      logger.error(
        `OffenderService (getVisitsFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: true,
      };
    }
  }

  async function getVisitsRemaining({ prisonerId }) {
    try {
      logger.info(`OffenderService (getVisitsRemaining) - User: ${prisonerId}`);
      const { remainingPvo = 0, remainingVo = 0 } =
        await repository.getVisitBalances(prisonerId);
      return { visitsRemaining: remainingPvo + remainingVo };
    } catch (e) {
      if (e?.response?.status === 404) return { visitsRemaining: 0 };
      logger.error(
        `OffenderService (getVisitsRemaining) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: true,
      };
    }
  }

  async function getImportantDatesFor({ prisonerId, bookingId }) {
    try {
      logger.info(
        `OffenderService (getImportantDatesFor) - User: ${prisonerId}`,
      );
      const response = await repository.sentenceDetailsFor(bookingId);
      return ImportantDates.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getImportantDatesFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show your important dates at this time',
      };
    }
  }

  async function getActualHomeEvents(bookingId, time) {
    const hour = Number.parseInt(format(time, HOUR), 10);
    const tomorrowCutOffHour = 19;

    if (hour >= tomorrowCutOffHour) {
      const tomorrow = addDays(time, 1);
      const startDate = format(time, ISO_DATE);
      const endDate = format(tomorrow, ISO_DATE);

      return {
        events: await repository.getEventsFor(bookingId, startDate, endDate),
        isTomorrow: true,
      };
    }

    return {
      events: await repository.getCurrentEvents(bookingId),
      isTomorrow: false,
    };
  }

  /*
   * Note this actually gets tomorrow's events if it's after 7pm as per this requirement:
   * https://trello.com/c/m5yt4sgm
   */
  async function getCurrentEvents(
    { prisonerId, bookingId },
    time = new Date(),
  ) {
    try {
      logger.info(`OffenderService (getCurrentEvents) - User: ${prisonerId}`);

      const { events, isTomorrow } = await getActualHomeEvents(bookingId, time);

      return !Array.isArray(events)
        ? { events: [], isTomorrow: false }
        : {
            events: events.map(eventResponse =>
              TimetableEvent.from(eventResponse).format(),
            ),
            isTomorrow,
          };
    } catch (e) {
      logger.error(
        `OffenderService (getCurrentEvents) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show your schedule for today at this time',
      };
    }
  }

  async function getEventsFor({ prisonerId, bookingId }, startDate, endDate) {
    try {
      logger.info(`OffenderService (getEventsFor) - User: ${prisonerId}`);

      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (!isValid(startDateObj) || !isValid(endDateObj)) {
        throw new Error('Invalid dates supplied');
      }

      if (isBefore(endDateObj, startDateObj)) {
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
    } catch (e) {
      logger.error(
        `OffenderService (getEventsFor) - Failed: ${e.message} - User: ${prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: `We are not able to show your timetable at this time`,
      };
    }
  }

  async function getEventsForToday(user, today = new Date()) {
    const todayString = format(today, 'yyyy-MM-dd');
    const results = await getEventsFor(user, todayString, todayString);
    return results.error ? { error: true } : results.events?.[todayString];
  }

  function getEmptyTimetable(startDate, endDate) {
    return Timetable.create({ startDate, endDate }).build();
  }

  return {
    getOffenderDetailsFor,
    getIncentivesSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getVisitorsFor,
    getVisitsFor,
    getVisitsRemaining,
    getImportantDatesFor,
    getCurrentEvents,
    getEventsFor,
    getEventsForToday,
    getEmptyTimetable,
  };
};

module.exports = {
  createPrisonApiOffenderService: createOffenderService,
};
