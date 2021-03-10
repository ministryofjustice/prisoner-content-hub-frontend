const Sentry = require('@sentry/node');
const { PrisonApiRepository } = require('../prisonApi');

jest.mock('@sentry/node');

describe('PrisonApiRepository', () => {
  const client = { get: jest.fn() };

  const apiUrl = 'http://foo.bar';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionsFor', () => {
    it('should return when the transactions request succeeds', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      const response = await repository.getTransactionsFor(
        'A1234BC',
        'spends',
        new Date('2020-01-01'),
        new Date('2020-01-31'),
      );

      expect(client.get).toHaveBeenCalledWith(
        'http://foo.bar/api/offenders/A1234BC/transaction-history?account_code=spends&from_date=2020-01-01&to_date=2020-01-31',
      );

      expect(response).toBe('API_RESPONSE');
    });

    it('should throw when no prisoner ID is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsFor(
          null,
          'spends',
          new Date('2020-01-01'),
          new Date('2020-01-31'),
        ),
      ).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should throw when no accountCode is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsFor(
          'A1234BC',
          null,
          new Date('2020-01-01'),
          new Date('2020-01-31'),
        ),
      ).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should throw when no fromDate is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsFor(
          'A1234BC',
          'spends',
          null,
          new Date('2020-01-31'),
        ),
      ).rejects.toThrow();
    });

    it('should throw when no toDate is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsFor(
          'A1234BC',
          'spends',
          new Date('2020-01-01'),
          null,
        ),
      ).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should swallow the error and return nothing when the request fails', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockRejectedValue('💥');

      const response = await repository.getTransactionsFor(
        'A1234BC',
        'spends',
        new Date('2020-01-01'),
        new Date('2020-01-31'),
      );

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(response).toBeNull();
    });
  });

  describe('getPrisonDetailsFor', () => {
    it('should return when the prison details request succeeds', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      const response = await repository.getPrisonDetails();

      expect(client.get).toHaveBeenCalledWith(
        'http://foo.bar/api/agencies/prison',
      );

      expect(response).toBe('API_RESPONSE');
    });

    it('should swallow the error and return nothing when the request fails', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockRejectedValue('💥');

      const response = await repository.getPrisonDetails();

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(response).toStrictEqual([]);
    });
  });

  describe('getBalancesFor', () => {
    it('should return when the balances request succeeds', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      const response = await repository.getBalancesFor(1234567);

      expect(client.get).toHaveBeenCalledWith(
        'http://foo.bar/api/bookings/1234567/balances',
      );

      expect(response).toBe('API_RESPONSE');
    });

    it('should throw when no bookingId is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(repository.getBalancesFor()).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should swallow the error and return nothing when the request fails', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockRejectedValue('💥');

      const response = await repository.getBalancesFor(1234567);

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(response).toBeNull();
    });
  });
});
