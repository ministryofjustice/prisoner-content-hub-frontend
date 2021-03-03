const { PrisonerInformationService } = require('../prisonerInformation');
const { User } = require('../../auth/user');

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

  const balances = {
    spends: 123,
    cash: 456,
    savings: 789,
    currency: 'GBP',
  };

  const prison = {
    agencyId: 'TST',
    description: 'Test (HMP)',
    longDescription: 'HMP Test',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisonApiRepository = {};
  });

  describe('getTransactionInformationFor', () => {
    it('returns transaction data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(transactions),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() =>
        Promise.resolve(balances),
      );
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(prison),
      );

      const data = await prisonerInformationService.getTransactionInformationFor(
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
        prison: 'HMP Test',
      });
    });

    it('returns default to using the agencyId for prison name when unable to find a match', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(transactions),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() =>
        Promise.resolve(balances),
      );
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(null),
      );

      const data = await prisonerInformationService.getTransactionInformationFor(
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

    it('returns a notification when unable to fetch transaction data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(null),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() =>
        Promise.resolve(balances),
      );
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(prison),
      );

      const data = await prisonerInformationService.getTransactionInformationFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('transactions');
      expect(data.transactions).toHaveProperty('error');
    });

    it('returns balance data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(transactions),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() =>
        Promise.resolve(balances),
      );
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(prison),
      );

      const data = await prisonerInformationService.getTransactionInformationFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('balances');
      expect(data.balances).toEqual(balances);
    });

    it('returns a notification when unable to fetch balance data', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(transactions),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() => Promise.resolve(null));
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(prison),
      );

      const data = await prisonerInformationService.getTransactionInformationFor(
        user,
        'spends',
        new Date('2021-01-01'),
        new Date('2021-01-01'),
      );

      expect(data).toHaveProperty('balances');
      expect(data.balances).toHaveProperty('error');
    });

    it('throws when called without a user', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(transactions),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() =>
        Promise.resolve(balances),
      );
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(prison),
      );

      let hasThrown = false;

      try {
        await prisonerInformationService.getTransactionInformationFor(
          null,
          'spends',
          new Date('2021-01-01'),
          new Date('2021-01-01'),
        );
      } catch (e) {
        expect(prisonApiRepository.getTransactionsFor).not.toHaveBeenCalled();
        expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
        expect(prisonApiRepository.getPrisonDetailsFor).not.toHaveBeenCalled();
        hasThrown = true;
      }

      expect(hasThrown).toBe(true);
    });

    it('throws when called without an account code', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(transactions),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() =>
        Promise.resolve(balances),
      );
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(prison),
      );

      let hasThrown = false;

      try {
        await prisonerInformationService.getTransactionInformationFor(
          user,
          null,
          new Date('2021-01-01'),
          new Date('2021-01-01'),
        );
      } catch (e) {
        expect(prisonApiRepository.getTransactionsFor).not.toHaveBeenCalled();
        expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
        expect(prisonApiRepository.getPrisonDetailsFor).not.toHaveBeenCalled();
        hasThrown = true;
      }

      expect(hasThrown).toBe(true);
    });

    it('throws when called without a from-date', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(transactions),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() =>
        Promise.resolve(balances),
      );
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(prison),
      );

      let hasThrown = false;

      try {
        await prisonerInformationService.getTransactionInformationFor(
          user,
          'spends',
          null,
          new Date('2021-01-01'),
        );
      } catch (e) {
        expect(prisonApiRepository.getTransactionsFor).not.toHaveBeenCalled();
        expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
        expect(prisonApiRepository.getPrisonDetailsFor).not.toHaveBeenCalled();
        hasThrown = true;
      }

      expect(hasThrown).toBe(true);
    });

    it('throws when called without a to-date', async () => {
      const prisonerInformationService = new PrisonerInformationService({
        prisonApiRepository,
      });

      prisonApiRepository.getTransactionsFor = jest.fn(() =>
        Promise.resolve(transactions),
      );
      prisonApiRepository.getBalancesFor = jest.fn(() =>
        Promise.resolve(balances),
      );
      prisonApiRepository.getPrisonDetailsFor = jest.fn(() =>
        Promise.resolve(prison),
      );

      let hasThrown = false;

      try {
        await prisonerInformationService.getTransactionInformationFor(
          user,
          'spends',
          new Date('2021-01-01'),
          null,
        );
      } catch (e) {
        expect(prisonApiRepository.getTransactionsFor).not.toHaveBeenCalled();
        expect(prisonApiRepository.getBalancesFor).not.toHaveBeenCalled();
        expect(prisonApiRepository.getPrisonDetailsFor).not.toHaveBeenCalled();
        hasThrown = true;
      }

      expect(hasThrown).toBe(true);
    });
  });
});
