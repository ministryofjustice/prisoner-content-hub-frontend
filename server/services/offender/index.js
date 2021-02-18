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
    NextVisit,
    ImportantDates,
    Timetable,
    TimetableEvent,
    Transaction,
  } = responses,
) => {
  async function getOffenderDetailsFor(user) {
    logger.info(
      `OffenderService (getOffenderDetailsFor) - User: ${user.prisonerId}`,
    );
    const response = await repository.getOffenderDetailsFor(user.prisonerId);
    return Offender.from(response).format();
  }

  async function getIncentivesSummaryFor(user) {
    try {
      logger.info(
        `OffenderService (getIncentivesSummaryFor) - User: ${user.prisonerId}`,
      );

      if (!user.bookingId) {
        throw new Error('No bookingId passed');
      }

      const response = await repository.getIncentivesSummaryFor(user.bookingId);
      return IncentivesSummary.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getIncentivesSummaryFor) - Failed: ${e.message} - User: ${user.prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error:
          'We are not able to show your incentive level summary at this time',
      };
    }
  }

  async function getBalancesFor(user) {
    try {
      logger.info(
        `OffenderService (getBalancesFor) - User: ${user.prisonerId}`,
      );

      if (!user.bookingId) {
        throw new Error('No bookingId passed');
      }

      const response = await repository.getBalancesFor(user.bookingId);
      return Balances.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getBalancesFor) - Failed: ${e.message} - User: ${user.prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show your balances at this time',
      };
    }
  }

  async function getTransactionsFor(user, accountCode, fromDate, toDate) {
    try {
      logger.info(
        `OffenderService (getTransactionsFor) - User: ${user.prisonerId}`,
      );

      if (!user.prisonerId) {
        throw new Error('No prisonerId passed');
      }

      const response = await repository.getTransactionsFor(
        user.prisonerId,
        accountCode,
        fromDate,
        toDate,
      );
      return response.map(t => Transaction.from(t).format());
    } catch (e) {
      logger.error(
        `OffenderService (getTransactionsFor) - Failed: ${e.message} - User: ${user.prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show your transactions at this time',
      };
    }
  }

  async function getKeyWorkerFor(user) {
    try {
      logger.info(
        `OffenderService (getKeyWorkerFor) - User: ${user.prisonerId}`,
      );

      if (!user.prisonerId) {
        throw new Error('No prisonerId passed');
      }

      const response = await repository.getKeyWorkerFor(user.prisonerId);
      return KeyWorker.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getKeyWorkerFor) - Failed: ${e.message} - User: ${user.prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show Key Worker information at this time',
      };
    }
  }

  async function getVisitsFor(user) {
    try {
      logger.info(`OffenderService (getVisitsFor) - User: ${user.prisonerId}`);

      if (!user.bookingId) {
        throw new Error('No bookingId passed');
      }

      const response = await repository.getNextVisitFor(user.bookingId);
      return NextVisit.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getVisitsFor) - Failed: ${e.message} - User: ${user.prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show your visits at this time',
      };
    }
  }

  async function getImportantDatesFor(user) {
    try {
      logger.info(
        `OffenderService (getImportantDatesFor) - User: ${user.prisonerId}`,
      );

      if (!user.bookingId) {
        throw new Error('No bookingId passed');
      }

      const response = await repository.sentenceDetailsFor(user.bookingId);
      return ImportantDates.from(response).format();
    } catch (e) {
      logger.error(
        `OffenderService (getImportantDatesFor) - Failed: ${e.message} - User: ${user.prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show your important dates at this time',
      };
    }
  }

  async function getActualHomeEvents(user, time) {
    const hour = Number.parseInt(format(time, HOUR), 10);
    const tomorrowCutOffHour = 19;

    if (hour >= tomorrowCutOffHour) {
      const tomorrow = addDays(time, 1);
      const startDate = format(time, ISO_DATE);
      const endDate = format(tomorrow, ISO_DATE);

      return {
        events: await repository.getEventsFor(
          user.bookingId,
          startDate,
          endDate,
        ),
        isTomorrow: true,
      };
    }

    return {
      events: await repository.getEventsForToday(user.bookingId),
      isTomorrow: false,
    };
  }

  /*
   * Note this actually gets tomorrow's events if it's after 7pm as per this requirement:
   * https://trello.com/c/m5yt4sgm
   */
  async function getEventsForToday(user, time = new Date()) {
    try {
      logger.info(
        `OffenderService (getEventsForToday) - User: ${user.prisonerId}`,
      );

      if (!user.bookingId) {
        throw new Error('No bookingId passed');
      }

      const { events, isTomorrow } = await getActualHomeEvents(user, time);

      return !Array.isArray(events)
        ? { todaysEvents: [], isTomorrow: false }
        : {
            todaysEvents: events.map(eventResponse =>
              TimetableEvent.from(eventResponse).format(),
            ),
            isTomorrow,
          };
    } catch (e) {
      logger.error(
        `OffenderService (getEventsForToday) - Failed: ${e.message} - User: ${user.prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: 'We are not able to show your schedule for today at this time',
      };
    }
  }

  async function getEventsFor(user, startDate, endDate) {
    try {
      logger.info(`OffenderService (getEventsFor) - User: ${user.prisonerId}`);

      if (!user.bookingId) {
        throw new Error('No bookingId passed');
      }

      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (!isValid(startDateObj) || !isValid(endDateObj)) {
        throw new Error('Invalid dates supplied');
      }

      if (!isBefore(startDateObj, endDateObj)) {
        throw new Error('Start date is after end date');
      }

      const eventsData = await repository.getEventsFor(
        user.bookingId,
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
        `OffenderService (getEventsFor) - Failed: ${e.message} - User: ${user.prisonerId}`,
      );
      logger.debug(e.stack);
      return {
        error: `We are not able to show your timetable at this time`,
      };
    }
  }

  function getEmptyTimetable(startDate, endDate) {
    return Timetable.create({ startDate, endDate }).build();
  }

  return {
    getOffenderDetailsFor,
    getIncentivesSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getVisitsFor,
    getImportantDatesFor,
    getEventsForToday,
    getEventsFor,
    getEmptyTimetable,
    getTransactionsFor,
  };
};

module.exports = {
  createPrisonApiOffenderService: createOffenderService,
};
