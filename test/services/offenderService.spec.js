const {
  createPrisonApiOffenderService,
} = require('../../server/services/offender');

const TEST_PRISONER_ID = 'A1234BC';
const TEST_BOOKING_ID = 1234;
const RAW_RESPONSE = 'RAW_RESPONSE';
const FORMATTED_RESPONSE = 'FORMATTED_RESPONSE';

const TEST_USER = {
  prisonerId: TEST_PRISONER_ID,
  bookingId: TEST_BOOKING_ID,
};

describe('Offender Service', () => {
  const format = sinon.stub();
  const from = sinon.stub();
  const mockAdapter = { from };

  beforeEach(() => {
    format.returns(FORMATTED_RESPONSE);
    from.returns({ format });
  });

  describe('getOffenderDetailsFor', () => {
    it('returns formatted Offender data', async () => {
      const repository = {
        getOffenderDetailsFor: sinon.stub().returns(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        Offender: mockAdapter,
      });

      const data = await service.getOffenderDetailsFor(TEST_USER);

      expect(repository.getOffenderDetailsFor).to.have.been.calledWith(
        TEST_PRISONER_ID,
      );
      expect(mockAdapter.from).to.have.been.calledWith(RAW_RESPONSE);
      expect(data).to.equal(FORMATTED_RESPONSE);
    });
  });

  describe('getIncentivesSummaryFor', () => {
    it('returns formatted incentives data', async () => {
      const repository = {
        getIncentivesSummaryFor: sinon.stub().returns(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        IncentivesSummary: mockAdapter,
      });

      const data = await service.getIncentivesSummaryFor(TEST_USER);

      expect(repository.getIncentivesSummaryFor).to.have.been.calledWith(
        TEST_BOOKING_ID,
      );
      expect(mockAdapter.from).to.have.been.calledWith(RAW_RESPONSE);
      expect(data).to.equal(FORMATTED_RESPONSE);
    });
  });

  describe('getBalancesFor', () => {
    it('returns formatted Balances data', async () => {
      const repository = {
        getBalancesFor: sinon.stub().returns(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        Balances: mockAdapter,
      });

      const data = await service.getBalancesFor(TEST_USER);

      expect(repository.getBalancesFor).to.have.been.calledWith(
        TEST_BOOKING_ID,
      );
      expect(mockAdapter.from).to.have.been.calledWith(RAW_RESPONSE);
      expect(data).to.equal(FORMATTED_RESPONSE);
    });
  });

  describe('getKeyWorkerFor', () => {
    it('returns formatted KeyWorker data', async () => {
      const repository = {
        getKeyWorkerFor: sinon.stub().returns(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        KeyWorker: mockAdapter,
      });

      const data = await service.getKeyWorkerFor(TEST_USER);

      expect(repository.getKeyWorkerFor).to.have.been.calledWith(
        TEST_PRISONER_ID,
      );
      expect(mockAdapter.from).to.have.been.calledWith(RAW_RESPONSE);
      expect(data).to.equal(FORMATTED_RESPONSE);
    });
  });

  describe('getVisitsFor', () => {
    it('returns formatted Visits data', async () => {
      const repository = {
        getNextVisitFor: sinon.stub().returns(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        NextVisit: mockAdapter,
      });

      const data = await service.getVisitsFor(TEST_USER);

      expect(repository.getNextVisitFor).to.have.been.calledWith(
        TEST_BOOKING_ID,
      );
      expect(mockAdapter.from).to.have.been.calledWith(RAW_RESPONSE);
      expect(data).to.equal(FORMATTED_RESPONSE);
    });
  });

  describe('getImportantDatesFor', () => {
    it('returns formatted ImportantDates data', async () => {
      const repository = {
        sentenceDetailsFor: sinon.stub().returns(RAW_RESPONSE),
      };

      const service = createPrisonApiOffenderService(repository, {
        ImportantDates: mockAdapter,
      });

      const data = await service.getImportantDatesFor(TEST_USER);

      expect(repository.sentenceDetailsFor).to.have.been.calledWith(
        TEST_BOOKING_ID,
      );
      expect(mockAdapter.from).to.have.been.calledWith(RAW_RESPONSE);
      expect(data).to.equal(FORMATTED_RESPONSE);
    });
  });

  describe('getEventsForToday', () => {});

  describe('getEventsFor', () => {
    const create = sinon.stub();
    const addEvents = sinon.stub();
    const build = sinon.stub();
    const mockTimetableAdapter = { create };

    beforeEach(() => {
      addEvents.resetHistory();
      create.resetHistory();
      build.returns(FORMATTED_RESPONSE);
      addEvents.returns({ build });
      create.returns({ addEvents });
    });

    it('should call the repository service with the correct bookingId', async () => {
      const repository = {
        getEventsFor: sinon.stub().returns(['FOO', 'BAR']),
      };

      const service = createPrisonApiOffenderService(repository, {
        Timetable: mockTimetableAdapter,
      });

      const data = await service.getEventsFor(
        TEST_USER,
        '2019-03-07',
        '2019-04-07',
      );

      expect(repository.getEventsFor.lastCall.args[0]).to.equal(
        TEST_BOOKING_ID,
        '2019-03-07',
        '2019-04-07',
      );
      expect(mockTimetableAdapter.create).to.have.been.calledWith({
        startDate: '2019-03-07',
        endDate: '2019-04-07',
      });
      expect(addEvents).to.have.been.calledWith(['FOO', 'BAR']);
      expect(data).to.equal(FORMATTED_RESPONSE);
    });

    it('should return an error response when passed invalid dates', async () => {
      const repository = {
        getEventsFor: sinon.stub().returns([]),
      };

      const service = createPrisonApiOffenderService(repository, {
        Timetable: mockTimetableAdapter,
      });

      const data = await service.getEventsFor(TEST_USER, 'FOO', 'BAR');

      expect(repository.getEventsFor).to.have.not.been.called;
      expect(mockTimetableAdapter.create).to.have.not.been.called;
      expect(data.error).to.exist;
    });

    it('should return an error response when passed an invalid date range', async () => {
      const repository = {
        getEventsFor: sinon.stub().returns([]),
      };

      const service = createPrisonApiOffenderService(repository, {
        Timetable: mockTimetableAdapter,
      });

      const data = await service.getEventsFor(
        TEST_BOOKING_ID,
        '2019-03-07',
        '2019-02-07',
      );

      expect(repository.getEventsFor).to.have.not.been.called;
      expect(mockTimetableAdapter.create).to.have.not.been.called;
      expect(data.error).to.exist;
    });

    it('should return an error response if the repository returns malformed data', async () => {
      const repository = {
        getEventsFor: sinon.stub().returns('FOO'),
      };

      const service = createPrisonApiOffenderService(repository, {
        Timetable: mockTimetableAdapter,
      });

      const data = await service.getEventsFor(
        TEST_USER,
        '2019-03-07',
        '2019-04-07',
      );

      expect(repository.getEventsFor).to.have.been.calledWith(
        TEST_BOOKING_ID,
        '2019-03-07',
        '2019-04-07',
      );
      expect(mockTimetableAdapter.create).to.have.not.been.called;
      expect(data.error).to.exist;
    });
  });
});
