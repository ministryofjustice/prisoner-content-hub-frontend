const Sentry = require('@sentry/node');
const PrisonApiRepository = require('../prisonApi');

jest.mock('@sentry/node');

describe('PrisonApiRepository', () => {
  const client = { get: jest.fn() };

  const apiUrl = 'http://foo.bar';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionsForDateRange', () => {
    it('should return when the transactions request succeeds', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      const response = await repository.getTransactionsForDateRange('A1234BC', {
        accountCode: 'spends',
        fromDate: new Date('2020-01-01'),
        toDate: new Date('2020-01-31'),
      });

      expect(client.get).toHaveBeenCalledWith(
        'http://foo.bar/api/offenders/A1234BC/transaction-history?account_code=spends&from_date=2020-01-01&to_date=2020-01-31',
      );

      expect(response).toBe('API_RESPONSE');
    });

    it('should throw when no prisoner ID is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsForDateRange(null, {
          accountCode: 'spends',
          fromDate: new Date('2020-01-01'),
          toDate: new Date('2020-01-31'),
        }),
      ).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should throw when no accountCode is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsForDateRange('A1234BC', {
          accountCode: null,
          fromDate: new Date('2020-01-01'),
          toDate: new Date('2020-01-31'),
        }),
      ).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should throw when no fromDate is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsForDateRange('A1234BC', {
          accountCode: 'spends',
          fromDate: 'expectToBreak',
          toDate: new Date('2020-01-31'),
        }),
      ).rejects.toThrow();
    });

    it('should throw when no toDate is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsForDateRange('A1234BC', {
          accountCode: 'spends',
          fromDate: new Date('2020-01-01'),
          toDate: 'expectToBreak',
        }),
      ).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should swallow the error and return nothing when the request fails', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockRejectedValue('💥');

      const response = await repository.getTransactionsForDateRange('A1234BC', {
        accountCode: 'spends',
        fromDate: new Date('2020-01-01'),
        toDate: new Date('2020-01-31'),
      });

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(response).toBeNull();
    });
  });

  describe('getTransactionsByType', () => {
    it('should return when the transactions request succeeds', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      const response = await repository.getTransactionsByType('A1234BC', {
        accountCode: 'cash',
        transactionType: 'HOA',
      });

      expect(client.get).toHaveBeenCalledWith(
        'http://foo.bar/api/offenders/A1234BC/transaction-history?account_code=cash&transaction_type=HOA',
      );

      expect(response).toBe('API_RESPONSE');
    });

    it('should throw when no prisoner ID is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsByType(null, {
          accountCode: 'cash',
          transactionType: 'HOA',
        }),
      ).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should throw when no accountCode is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsByType('A1234BC', {
          transactionType: 'HOA',
        }),
      ).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should throw when no transactionType is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(
        repository.getTransactionsByType('A1234BC', {
          accountCode: 'cash',
        }),
      ).rejects.toThrow();
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
      expect(response).toBeNull();
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

  describe('getDamageObligationsFor', () => {
    it('should return when the request for damage obligations succeeds', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      const response = await repository.getDamageObligationsFor('A1234BC');

      expect(client.get).toHaveBeenCalledWith(
        'http://foo.bar/api/offenders/A1234BC/damage-obligations',
      );

      expect(response).toBe('API_RESPONSE');
    });

    it('should throw when no prisoner ID is passed', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockResolvedValue('API_RESPONSE');

      await expect(repository.getDamageObligationsFor()).rejects.toThrow();

      expect(client.get).not.toHaveBeenCalled();
    });

    it('should swallow the error and return nothing when the request fails', async () => {
      const repository = new PrisonApiRepository({ client, apiUrl });

      client.get.mockRejectedValue('💥');

      const response = await repository.getDamageObligationsFor('A1234BC');

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(response).toBeNull();
    });
  });
});
