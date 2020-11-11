const { createPrisonApiOffenderService } = require('../offender');

const TEST_PRISONER_ID = 'A1234BC';
const TEST_BOOKING_ID = 1234;
const RAW_RESPONSE = 'RAW_RESPONSE';
const FORMATTED_RESPONSE = 'FORMATTED_RESPONSE';

const TEST_USER = {
  prisonerId: TEST_PRISONER_ID,
  bookingId: TEST_BOOKING_ID,
};

describe('Offender Service', () => {
  const format = jest.fn();
  const from = jest.fn();
  const mockAdapter = { from };

  beforeEach(() => {
    format.mockReturnValue(FORMATTED_RESPONSE);
    from.mockReturnValue({ format });
  });

  describe('getOffenderDetailsFor', () => {
    it('returns formatted Offender data', async () => {
      const repository = {
        getOffenderDetailsFor: jest.fn().mockReturnValue(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        Offender: mockAdapter,
      });

      const data = await service.getOffenderDetailsFor(TEST_USER);

      expect(repository.getOffenderDetailsFor).toHaveBeenCalledWith(
        TEST_PRISONER_ID,
      );
      expect(mockAdapter.from).toHaveBeenCalledWith(RAW_RESPONSE);
      expect(data).toBe(FORMATTED_RESPONSE);
    });
  });

  describe('getIncentivesSummaryFor', () => {
    it('returns formatted incentives data', async () => {
      const repository = {
        getIncentivesSummaryFor: jest.fn().mockReturnValue(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        IncentivesSummary: mockAdapter,
      });

      const data = await service.getIncentivesSummaryFor(TEST_USER);

      expect(repository.getIncentivesSummaryFor).toHaveBeenCalledWith(
        TEST_BOOKING_ID,
      );
      expect(mockAdapter.from).toHaveBeenCalledWith(RAW_RESPONSE);
      expect(data).toBe(FORMATTED_RESPONSE);
    });
  });

  describe('getBalancesFor', () => {
    it('returns formatted Balances data', async () => {
      const repository = {
        getBalancesFor: jest.fn().mockReturnValue(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        Balances: mockAdapter,
      });

      const data = await service.getBalancesFor(TEST_USER);

      expect(repository.getBalancesFor).toHaveBeenCalledWith(TEST_BOOKING_ID);
      expect(mockAdapter.from).toHaveBeenCalledWith(RAW_RESPONSE);
      expect(data).toBe(FORMATTED_RESPONSE);
    });
  });

  describe('getKeyWorkerFor', () => {
    it('returns formatted KeyWorker data', async () => {
      const repository = {
        getKeyWorkerFor: jest.fn().mockReturnValue(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        KeyWorker: mockAdapter,
      });

      const data = await service.getKeyWorkerFor(TEST_USER);

      expect(repository.getKeyWorkerFor).toHaveBeenCalledWith(TEST_PRISONER_ID);
      expect(mockAdapter.from).toHaveBeenCalledWith(RAW_RESPONSE);
      expect(data).toBe(FORMATTED_RESPONSE);
    });
  });

  describe('getVisitsFor', () => {
    it('returns formatted Visits data', async () => {
      const repository = {
        getNextVisitFor: jest.fn().mockReturnValue(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        NextVisit: mockAdapter,
      });

      const data = await service.getVisitsFor(TEST_USER);

      expect(repository.getNextVisitFor).toHaveBeenCalledWith(TEST_BOOKING_ID);
      expect(mockAdapter.from).toHaveBeenCalledWith(RAW_RESPONSE);
      expect(data).toBe(FORMATTED_RESPONSE);
    });
  });

  describe('getImportantDatesFor', () => {
    it('returns formatted ImportantDates data', async () => {
      const repository = {
        sentenceDetailsFor: jest.fn().mockReturnValue(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        ImportantDates: mockAdapter,
      });

      const data = await service.getImportantDatesFor(TEST_USER);

      expect(repository.sentenceDetailsFor).toHaveBeenCalledWith(
        TEST_BOOKING_ID,
      );
      expect(mockAdapter.from).toHaveBeenCalledWith(RAW_RESPONSE);
      expect(data).toBe(FORMATTED_RESPONSE);
    });
  });

  describe('getEventsForToday', () => {});

  describe('getEventsFor', () => {
    const create = jest.fn();
    const addEvents = jest.fn();
    const build = jest.fn();
    const mockTimetableAdapter = { create };

    beforeEach(() => {
      addEvents.mockClear();
      create.mockClear();
      build.mockReturnValue(FORMATTED_RESPONSE);
      addEvents.mockReturnValue({ build });
      create.mockReturnValue({ addEvents });
    });

    it('should call the repository service with the correct bookingId', async () => {
      const repository = {
        getEventsFor: jest.fn().mockReturnValue(['FOO', 'BAR']),
      };

      const service = createPrisonApiOffenderService(repository, {
        Timetable: mockTimetableAdapter,
      });

      const data = await service.getEventsFor(
        TEST_USER,
        '2019-03-07',
        '2019-04-07',
      );

      expect(
        repository.getEventsFor.mock.calls[
          repository.getEventsFor.mock.calls.length - 1
        ][0],
      ).toBe(TEST_BOOKING_ID, '2019-03-07', '2019-04-07');
      expect(mockTimetableAdapter.create).toHaveBeenCalledWith({
        startDate: '2019-03-07',
        endDate: '2019-04-07',
      });
      expect(addEvents).toHaveBeenCalledWith(['FOO', 'BAR']);
      expect(data).toBe(FORMATTED_RESPONSE);
    });

    it('should return an error response when passed invalid dates', async () => {
      const repository = {
        getEventsFor: jest.fn().mockReturnValue([]),
      };

      const service = createPrisonApiOffenderService(repository, {
        Timetable: mockTimetableAdapter,
      });

      const data = await service.getEventsFor(TEST_USER, 'FOO', 'BAR');

      expect(repository.getEventsFor).not.toHaveBeenCalled();
      expect(mockTimetableAdapter.create).not.toHaveBeenCalled();
      expect(data.error).toBeDefined();
    });

    it('should return an error response when passed an invalid date range', async () => {
      const repository = {
        getEventsFor: jest.fn().mockReturnValue([]),
      };

      const service = createPrisonApiOffenderService(repository, {
        Timetable: mockTimetableAdapter,
      });

      const data = await service.getEventsFor(
        TEST_BOOKING_ID,
        '2019-03-07',
        '2019-02-07',
      );

      expect(repository.getEventsFor).not.toHaveBeenCalled();
      expect(mockTimetableAdapter.create).not.toHaveBeenCalled();
      expect(data.error).toBeDefined;
    });

    it('should return an error response if the repository returns malformed data', async () => {
      const repository = {
        getEventsFor: jest.fn().mockReturnValue('FOO'),
      };

      const service = createPrisonApiOffenderService(repository, {
        Timetable: mockTimetableAdapter,
      });

      const data = await service.getEventsFor(
        TEST_USER,
        '2019-03-07',
        '2019-04-07',
      );

      expect(repository.getEventsFor).toHaveBeenCalledWith(
        TEST_BOOKING_ID,
        '2019-03-07',
        '2019-04-07',
      );
      expect(mockTimetableAdapter.create).not.toHaveBeenCalled();
      expect(data.error).toBeDefined;
    });
  });
});
