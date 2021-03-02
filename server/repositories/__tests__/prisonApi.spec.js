const { PrisonApiRepository } = require('../prisonApi');
const { lastCall } = require('../../../test/test-helpers');

describe('PrisonApiRepository', () => {
  const client = { get: jest.fn() };

  const config = {
    prisonApi: {
      endpoints: {
        base: '/api',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionsFor', () => {
    it('should return when the transactions request succeeds', async () => {
      const repository = new PrisonApiRepository({ client, config });

      client.get.mockImplementation(() => Promise.resolve('API_RESPONSE'));

      const response = await repository.getTransactionsFor(
        'A123BC',
        'spends',
        new Date('2020-01-01'),
        new Date('2020-01-31'),
      );

      expect(lastCall(client.get)[0]).toContain(
        '/offenders/A123BC/transaction-history',
      );
      expect(lastCall(client.get)[0]).toContain('account_code=spends');
      expect(lastCall(client.get)[0]).toContain('from_date=2020-01-01');
      expect(lastCall(client.get)[0]).toContain('to_date=2020-01-31');

      expect(response).toBe('API_RESPONSE');
    });

    it('should throw when no prisoner ID is passed', async () => {
      const repository = new PrisonApiRepository({ client, config });

      client.get.mockImplementation(() => Promise.resolve('API_RESPONSE'));

      let hasThrown = false;

      try {
        await repository.getTransactionsFor(
          null,
          'spends',
          new Date('2020-01-01'),
          new Date('2020-01-31'),
        );
      } catch (e) {
        hasThrown = true;
        expect(client.get).not.toHaveBeenCalled();
      }

      expect(hasThrown).toBe(true);
    });

    it('should throw when no accountCode is passed', async () => {
      const repository = new PrisonApiRepository({ client, config });

      client.get.mockImplementation(() => Promise.resolve('API_RESPONSE'));

      let hasThrown = false;

      try {
        await repository.getTransactionsFor(
          'A123BC',
          null,
          new Date('2020-01-01'),
          new Date('2020-01-31'),
        );
      } catch (e) {
        hasThrown = true;
        expect(client.get).not.toHaveBeenCalled();
      }

      expect(hasThrown).toBe(true);
    });

    it('should throw when no fromDate is passed', async () => {
      const repository = new PrisonApiRepository({ client, config });

      client.get.mockImplementation(() => Promise.resolve('API_RESPONSE'));

      let hasThrown = false;

      try {
        await repository.getTransactionsFor(
          'A123BC',
          'spends',
          null,
          new Date('2020-01-31'),
        );
      } catch (e) {
        hasThrown = true;
        expect(client.get).not.toHaveBeenCalled();
      }

      expect(hasThrown).toBe(true);
    });

    it('should throw when no toDate is passed', async () => {
      const repository = new PrisonApiRepository({ client, config });

      client.get.mockImplementation(() => Promise.resolve('API_RESPONSE'));

      let hasThrown = false;

      try {
        await repository.getTransactionsFor(
          'A123BC',
          'spends',
          new Date('2020-01-01'),
          null,
        );
      } catch (e) {
        hasThrown = true;
        expect(client.get).not.toHaveBeenCalled();
      }

      expect(hasThrown).toBe(true);
    });

    it('should swallow the error and return nothing when the request fails', async () => {
      const repository = new PrisonApiRepository({ client, config });

      client.get.mockImplementation(() => Promise.rejects('💥'));

      const response = await repository.getTransactionsFor(
        'A123BC',
        'spends',
        new Date('2020-01-01'),
        new Date('2020-01-31'),
      );

      expect(response).toBeNull();
    });
  });
});
