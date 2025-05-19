const Sentry = require('@sentry/node');
const { User } = require('../../auth/user');
const PrisonerInformationService = require('../prisonerInformation');
const PrisonApi = require('../../repositories/prisonApi');

jest.mock('@sentry/node');
jest.mock('../../repositories/prisonApi');

describe('PrisonerInformation', () => {
  let prisonApiRepository = {};

  const user = new User({
    prisonerId: 'PRISONER_ID',
    firstName: 'Test',
    surname: 'User',
    bookingId: 'BOOKING_ID',
  });

  const transactions = [
    {
      paymentDate: '2021-01-03',
      postingType: 'CR',
      penceAmount: 10,
      currency: 'GBP',
      balance: 30,
      entryDescription: 'Received some money',
      agencyId: 'TST',
    },
    {
      paymentDate: '2021-01-02',
      postingType: 'CR',
      penceAmount: 10,
      currency: 'GBP',
      balance: 20,
      entryDescription: 'Received some money',
      agencyId: 'TST',
    },
    {
      paymentDate: '2021-01-01',
      postingType: 'CR',
      penceAmount: 10,
      currency: 'GBP',
      balance: 10,
      entryDescription: 'Received some money',
      agencyId: 'TST',
    },
  ];

  const pendingTransactions = [
    {
      entryDate: '2021-03-29',
      transactionType: 'HOA',
      entryDescription: 'Pending',
      currency: 'GBP',
      penceAmount: 5000,
      accountType: 'REG',
      postingType: 'CR',
      agencyId: 'TST',
      relatedOffenderTransactions: [],
      currentBalance: 0,
    },
  ];

  const balances = {
    spends: 123,
    cash: 456,
    savings: 789,
    currency: 'GBP',
  };

  const prisons = [
    {
      agencyId: 'TST',
      description: 'Test (HMP)',
    },
    {
      agencyId: 'TST2',
      description: 'Test 2 (HMP)',
    },
  ];

  const damageObligations = {
    damageObligations: [
      {
        amountPaid: 10,
        amountToPay: 50,
        comment: 'Damages to canteen furniture',
        currency: 'GBP',
        endDateTime: '2021-03-15T11:49:58.502Z',
        id: 1,
        offenderNo: 'A1234BC',
        prisonId: 'TST',
        referenceNumber: '841177/1, A841821/1, 842371',
        startDateTime: '2021-03-15T11:49:58.502Z',
        status: 'ACTIVE',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisonApiRepository = new PrisonApi();
  });

  describe('getTransactionsFor', () => {
    it('returns transaction data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getTransactionsFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('transactions');
      expect(data.transactions.length).toBe(3);
      expect(data.transactions[0]).toEqual({
        paymentDate: '2021-01-03',
        postingType: 'CR',
        penceAmount: 10,
        currency: 'GBP',
        balance: 30,
        entryDescription: 'Received some money',
        agencyId: 'TST',
        prison: 'Test (HMP)',
      });
    });

    it('defaults to using the agencyId for prison name when unable to find a match', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue([]);

      const data = await prisonerInformationService.getTransactionsFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('transactions');
      expect(data.transactions.length).toBe(3);
      expect(data.transactions[0]).toEqual({
        paymentDate: '2021-01-03',
        postingType: 'CR',
        penceAmount: 10,
        currency: 'GBP',
        balance: 30,
        entryDescription: 'Received some money',
        agencyId: 'TST',
        prison: 'TST',
      });
    });

    it('returns null when unable to fetch transaction data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(null);
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getTransactionsFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('transactions');
      expect(data.transactions).toBeNull();
    });

    it('returns balance data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getTransactionsFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('balances');
      expect(data.balances).toEqual(balances);
    });

    it('returns null when unable to fetch balance data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(null);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getTransactionsFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('balances');
      expect(data.balances).toBeNull();
    });

    it('throws when called without a user', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      await expect(
        prisonerInformationService.getTransactionsFor(
          null,
          'spends',
          new Date('2021-01-01'),
          new Date('2021-01-01'),
        ),
      ).rejects.toThrow();

      expect(
        prisonApiRepository.getTransactionsForDateRange,
      ).not.toHaveBeenCalled();
      expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
      expect(prisonApiRepository.getPrisonDetails).not.toHaveBeenCalled();
    });

    it('throws when called without an account code', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      await expect(
        prisonerInformationService.getTransactionsFor(
          user,
          null,
          new Date('2021-01-01'),
          new Date('2021-01-01'),
        ),
      ).rejects.toThrow();

      expect(
        prisonApiRepository.getTransactionsForDateRange,
      ).not.toHaveBeenCalled();
      expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
      expect(prisonApiRepository.getPrisonDetails).not.toHaveBeenCalled();
    });

    it('throws when called without a from-date', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      await expect(
        prisonerInformationService.getTransactionsFor(
          user,
          'spends',
          null,
          new Date('2021-01-01'),
        ),
      ).rejects.toThrow();

      expect(
        prisonApiRepository.getTransactionsForDateRange,
      ).not.toHaveBeenCalled();
      expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
      expect(prisonApiRepository.getPrisonDetails).not.toHaveBeenCalled();
    });

    it('throws when called without a to-date', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      await expect(
        prisonerInformationService.getTransactionsFor(
          user,
          'spends',
          new Date('2021-01-01'),
          null,
        ),
      ).rejects.toThrow();

      expect(
        prisonApiRepository.getTransactionsForDateRange,
      ).not.toHaveBeenCalled();
      expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
      expect(prisonApiRepository.getPrisonDetails).not.toHaveBeenCalled();
    });

    it('swallows the exception and return null if an error is thrown getting transactions', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockRejectedValue('💥');
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const result = await prisonerInformationService.getTransactionsFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(result).toBeNull();
    });

    it('swallows the exception and return null if an error is thrown getting balances', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockRejectedValue('💥');
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const result = await prisonerInformationService.getTransactionsFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(result).toBeNull();
    });

    it('swallows the exception and return null if an error is thrown getting prison details', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockRejectedValue('💥');

      const result = await prisonerInformationService.getTransactionsFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(result).toBeNull();
    });
  });

  describe('getPrivateTransactionsFor', () => {
    it('returns transaction data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('transactions');
      expect(data.transactions.length).toBe(3);
      expect(data.transactions[0]).toEqual({
        paymentDate: '2021-01-03',
        postingType: 'CR',
        penceAmount: 10,
        currency: 'GBP',
        balance: 30,
        entryDescription: 'Received some money',
        agencyId: 'TST',
        prison: 'Test (HMP)',
      });
    });
    it('returns null when unable to fetch transaction data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(null);
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('transactions');
      expect(data.transactions).toBeNull();
    });

    it('returns pending transactions', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('pending');
      expect(data.pending.length).toBe(2);
      expect(data.pending[0]).toEqual({
        accountType: 'REG',
        entryDate: '2021-03-29',
        postingType: 'CR',
        penceAmount: 5000,
        currency: 'GBP',
        currentBalance: 0,
        entryDescription: 'Pending',
        agencyId: 'TST',
        prison: 'Test (HMP)',
        transactionType: 'HOA',
        relatedOffenderTransactions: [],
      });
    });

    it('returns null when unable to fetch pending transaction data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(null);
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data.pending).toBeNull();
    });

    it('defaults to using the agencyId when unable to find a match', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(null);

      const data = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('pending');
      expect(data.pending.length).toBe(2);
      expect(data.pending[0]).toEqual({
        accountType: 'REG',
        entryDate: '2021-03-29',
        postingType: 'CR',
        penceAmount: 5000,
        currency: 'GBP',
        currentBalance: 0,
        entryDescription: 'Pending',
        agencyId: 'TST',
        prison: 'TST',
        transactionType: 'HOA',
        relatedOffenderTransactions: [],
      });
    });
    it('returns balance data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('balances');
      expect(data.balances).toEqual(balances);
    });
    it('returns null when unable to fetch balance data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(null);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data.balances).toBeNull();
    });

    it('throws when called without a user', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      await expect(
        prisonerInformationService.getPrivateTransactionsFor(
          null,
          new Date('2021-01-01'),
          new Date('2021-01-01'),
        ),
      ).rejects.toThrow();

      expect(
        prisonApiRepository.getTransactionsForDateRange,
      ).not.toHaveBeenCalled();
      expect(prisonApiRepository.getTransactionsByType).not.toHaveBeenCalled();
      expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
      expect(prisonApiRepository.getPrisonDetails).not.toHaveBeenCalled();
    });

    it('throws when called without a from-date', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      await expect(
        prisonerInformationService.getPrivateTransactionsFor(
          user,
          null,
          new Date('2021-01-01'),
        ),
      ).rejects.toThrow();

      expect(
        prisonApiRepository.getTransactionsForDateRange,
      ).not.toHaveBeenCalled();
      expect(prisonApiRepository.getTransactionsByType).not.toHaveBeenCalled();
      expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
      expect(prisonApiRepository.getPrisonDetails).not.toHaveBeenCalled();
    });

    it('throws when called without a to-date', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      await expect(
        prisonerInformationService.getPrivateTransactionsFor(
          user,
          new Date('2021-01-01'),
          null,
        ),
      ).rejects.toThrow();

      expect(
        prisonApiRepository.getTransactionsForDateRange,
      ).not.toHaveBeenCalled();
      expect(prisonApiRepository.getTransactionsByType).not.toHaveBeenCalled();
      expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
      expect(prisonApiRepository.getPrisonDetails).not.toHaveBeenCalled();
    });

    it('swallows the exception and return null if an error is thrown getting transactions', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockRejectedValue('💥');
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const result = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(result).toBeNull();
    });

    it('swallows the exception and return null if an error is thrown getting pending transactions', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockRejectedValue('💥');
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const result = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(result).toBeNull();
    });

    it('swallows the exception and return null if an error is thrown getting balances', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockRejectedValue('💥');
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const result = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(result).toBeNull();
    });

    it('swallows the exception and return null if an error is thrown getting prison details', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsForDateRange.mockResolvedValue(
        transactions,
      );
      prisonApiRepository.getTransactionsByType.mockResolvedValue(
        pendingTransactions,
      );
      prisonApiRepository.getBalancesFor.mockResolvedValue(balances);
      prisonApiRepository.getPrisonDetails.mockRejectedValue('💥');

      const result = await prisonerInformationService.getPrivateTransactionsFor(
        user,
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(Sentry.captureException).toHaveBeenCalledWith('💥');
      expect(result).toBeNull();
    });
  });

  describe('getDamageObligationsFor', () => {
    it('returns damage obligations data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getDamageObligationsFor.mockResolvedValue(
        damageObligations,
      );
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data =
        await prisonerInformationService.getDamageObligationsFor(user);

      expect(prisonApiRepository.getDamageObligationsFor).toHaveBeenCalledWith(
        user.prisonerId,
      );
      expect(data).toEqual([
        {
          amountPaid: 10,
          amountToPay: 50,
          comment: 'Damages to canteen furniture',
          currency: 'GBP',
          endDateTime: '2021-03-15T11:49:58.502Z',
          id: 1,
          offenderNo: 'A1234BC',
          prisonId: 'TST',
          prison: 'Test (HMP)',
          referenceNumber: '841177/1, A841821/1, 842371',
          startDateTime: '2021-03-15T11:49:58.502Z',
          status: 'ACTIVE',
        },
      ]);
    });

    it('uses the prisonId when unable to find a prison name', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getDamageObligationsFor.mockResolvedValue(
        damageObligations,
      );
      prisonApiRepository.getPrisonDetails.mockResolvedValue([]);

      const data =
        await prisonerInformationService.getDamageObligationsFor(user);

      expect(prisonApiRepository.getDamageObligationsFor).toHaveBeenCalledWith(
        user.prisonerId,
      );
      expect(data).toEqual([
        {
          amountPaid: 10,
          amountToPay: 50,
          comment: 'Damages to canteen furniture',
          currency: 'GBP',
          endDateTime: '2021-03-15T11:49:58.502Z',
          id: 1,
          offenderNo: 'A1234BC',
          prisonId: 'TST',
          prison: 'TST',
          referenceNumber: '841177/1, A841821/1, 842371',
          startDateTime: '2021-03-15T11:49:58.502Z',
          status: 'ACTIVE',
        },
      ]);
    });

    it('returns null when unable to fetch damage obligations data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getDamageObligationsFor.mockResolvedValue(null);
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data =
        await prisonerInformationService.getDamageObligationsFor(user);

      expect(data).toBeNull();
    });

    it('swallows the exception and returns null if an error is thrown fetching damage obligations', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getDamageObligationsFor.mockRejectedValue('💥');
      prisonApiRepository.getPrisonDetails.mockResolvedValue(prisons);

      const data =
        await prisonerInformationService.getDamageObligationsFor(user);

      expect(data).toEqual(null);
    });

    it('throws when called without a user', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      await expect(
        prisonerInformationService.getDamageObligationsFor(),
      ).rejects.toThrow();

      expect(
        prisonApiRepository.getDamageObligationsFor,
      ).not.toHaveBeenCalled();
    });
  });
});
