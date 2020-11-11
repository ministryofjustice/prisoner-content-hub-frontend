const { offenderRepository } = require('../offender');

describe('offenderRepository', () => {
  describe('getOffenderDetailsFor', () => {
    it('validates the offender number before making a call to the API', async () => {
      const offenderNumber = '1234567';
      const client = {
        get: jest.fn(),
      };
      const repository = offenderRepository(client);

      let exception = null;

      try {
        await repository.getOffenderDetailsFor(offenderNumber);
      } catch (e) {
        exception = e;
      }

      expect(exception.message).toBe('Invalid offender number');
      expect(client.get).not.toHaveBeenCalled();
    });
    it('should make the offender number uppercase before making a call to the API', async () => {
      const offenderNumber = 'a1234bc';
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getOffenderDetailsFor(offenderNumber);

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain(`/offenderNo/${offenderNumber.toUpperCase()}`);
      expect(result).toBe('SOME_RESULT');
    });
    it('calls the offender endpoint for a given ID', async () => {
      const offenderNumber = 'A1234BC';
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getOffenderDetailsFor(offenderNumber);

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain(`/offenderNo/${offenderNumber}`);
      expect(result).toBe('SOME_RESULT');
    });
  });

  describe('getIncentivesSummaryFor', () => {
    it('calls the Incentives summary endpoint for a given ID', async () => {
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getIncentivesSummaryFor('FOO_ID');

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('/FOO_ID/iepSummary');
      expect(result).toBe('SOME_RESULT');
    });
  });

  describe('getBalancesFor', () => {
    it('calls the balances endpoint for a given ID', async () => {
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getBalancesFor('FOO_ID');

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('/FOO_ID/balances');
      expect(result).toBe('SOME_RESULT');
    });
  });

  describe('getKeyWorkerFor', () => {
    it('calls the keyWorker endpoint for a given ID', async () => {
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getKeyWorkerFor('FOO_ID');

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('/FOO_ID/key-worker');
      expect(result).toBe('SOME_RESULT');
    });
  });

  describe('getNextVisitFor', () => {
    it('calls the nextVisit endpoint for a given ID', async () => {
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getNextVisitFor('FOO_ID');

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('/FOO_ID/visits/next');
      expect(result).toBe('SOME_RESULT');
    });
  });

  describe('getLastVisitFor', () => {
    it('calls the lastVisits endpoint for a given ID', async () => {
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getLastVisitFor('FOO_ID');

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('/FOO_ID/visits/last');
      expect(result).toBe('SOME_RESULT');
    });
  });

  describe('sentenceDetailsFor', () => {
    it('calls the sentenceDetails endpoint for a given ID', async () => {
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.sentenceDetailsFor('FOO_ID');

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('/FOO_ID/sentenceDetail');
      expect(result).toBe('SOME_RESULT');
    });
  });

  describe('getEventsForToday', () => {
    it('calls the getEventsForToday endpoint for a given ID', async () => {
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getEventsForToday('FOO_ID');

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('/FOO_ID/events/today');
      expect(result).toBe('SOME_RESULT');
    });
  });

  describe('getEventsFor', () => {
    it('calls the getEventsFor endpoint for a given ID', async () => {
      const client = {
        get: jest.fn().mockResolvedValue('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getEventsFor(
        'FOO_ID',
        '2019-04-07',
        '2019-04-07',
      );

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('/FOO_ID/events');
      expect(result).toBe('SOME_RESULT');
    });
  });
});
