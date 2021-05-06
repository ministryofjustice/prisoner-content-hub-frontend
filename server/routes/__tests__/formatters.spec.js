const Sentry = require('@sentry/node');
const {
  createTransactionsResponseFrom,
  createDamageObligationsResponseFrom,
  createPendingTransactionsResponseFrom,
} = require('../formatters');

jest.mock('@sentry/node');

describe('Responses', () => {
  describe('createTransactionsResponseFrom', () => {
    const transactionApiResponse = [
      {
        entryDate: '2021-02-23',
        transactionType: 'TELE',
        entryDescription: 'Television',
        currency: 'GBP',
        penceAmount: 50,
        accountType: 'SPND',
        postingType: 'DR',
        prison: 'HMP Test',
        currentBalance: 12345,
        relatedOffenderTransactions: [],
      },
    ];

    const relatedTransactions = [
      {
        entryDate: '2021-03-09',
        transactionType: 'TELE',
        entryDescription: 'Television',
        currency: 'GBP',
        penceAmount: 50,
        accountType: 'SPND',
        postingType: 'DR',
        prison: 'HMP Test',
        currentBalance: 12295,
        relatedOffenderTransactions: [],
      },
      {
        entryDate: '2021-03-08',
        transactionType: 'A_EARN',
        entryDescription: 'Payroll',
        currency: 'GBP',
        penceAmount: 100,
        accountType: 'SPND',
        postingType: 'CR',
        prison: 'HMP Test',
        currentBalance: 12345,
        relatedOffenderTransactions: [
          {
            transactionEntrySequence: 1,
            calendarDate: '2021-03-07',
            payTypeCode: 'TST2',
            eventId: null,
            payAmount: 50,
            pieceWork: 0,
            bonusPay: 0,
            paymentDescription: 'Test 2',
          },
          {
            transactionEntrySequence: 1,
            calendarDate: '2021-03-08',
            payTypeCode: 'TST',
            eventId: null,
            payAmount: 50,
            pieceWork: 0,
            bonusPay: 0,
            paymentDescription: 'Test 1',
          },
        ],
      },
    ];

    const balancesApiResponse = {
      spends: 123.45,
      cash: 456.78,
      savings: 890.12,
      damageObligations: 50,
      currency: 'GBP',
    };

    it('formats positive transactions when present', () => {
      const formatted = createTransactionsResponseFrom('spends', {
        transactions: [
          {
            entryDate: '2021-02-23',
            transactionType: 'TELE',
            entryDescription: 'Television',
            currency: 'GBP',
            penceAmount: 50,
            accountType: 'SPND',
            postingType: 'CR',
            prison: 'HMP Test',
            currentBalance: 12345,
          },
        ],
        balances: balancesApiResponse,
      });

      expect(formatted.transactions.rows).toEqual([
        [
          { text: '23 February 2021' },
          { text: '£0.50' },
          { text: null },
          { text: '£123.45' },
          { text: 'Television' },
          { text: 'HMP Test' },
        ],
      ]);
    });

    it('formats negative transactions when present', () => {
      const formatted = createTransactionsResponseFrom('spends', {
        transactions: [
          {
            entryDate: '2021-02-23',
            transactionType: 'TELE',
            entryDescription: 'Television',
            currency: 'GBP',
            penceAmount: 50,
            accountType: 'SPND',
            postingType: 'DR',
            prison: 'HMP Test',
            currentBalance: 12345,
          },
        ],
        balances: balancesApiResponse,
      });

      expect(formatted.transactions.rows).toEqual([
        [
          { text: '23 February 2021' },
          { text: null },
          { text: '-£0.50' },
          { text: '£123.45' },
          { text: 'Television' },
          { text: 'HMP Test' },
        ],
      ]);
    });

    it('formats related transactions when present', () => {
      const formatted = createTransactionsResponseFrom('spends', {
        transactions: relatedTransactions,
        balances: balancesApiResponse,
      });

      expect(formatted.transactions.rows).toEqual([
        [
          { text: '9 March 2021' },
          { text: null },
          { text: '-£0.50' },
          { text: '£122.95' },
          { text: 'Television' },
          { text: 'HMP Test' },
        ],
        [
          { text: '8 March 2021' },
          { text: '£0.50' },
          { text: null },
          { text: '£123.45' },
          { text: 'Test 1 from 8 March 2021' },
          { text: 'HMP Test' },
        ],
        [
          { text: '8 March 2021' },
          { text: '£0.50' },
          { text: null },
          { text: '£122.95' },
          { text: 'Test 2 from 7 March 2021' },
          { text: 'HMP Test' },
        ],
      ]);
    });

    it('returns an error notification when unable to process transactions data', () => {
      const formatted = createTransactionsResponseFrom('spends', {
        transactions: null,
        balances: balancesApiResponse,
      });

      expect(formatted.transactions.userNotification).toBeDefined();
    });

    it('captures the exception in Sentry when an exception is thrown', () => {
      createTransactionsResponseFrom('spends', {
        transactions: [undefined],
        balances: balancesApiResponse,
      });

      expect(Sentry.captureException).toHaveBeenCalled();
    });

    it('formats balance data when present', () => {
      const formatted = createTransactionsResponseFrom('spends', {
        transactions: transactionApiResponse,
        balances: balancesApiResponse,
      });

      expect(formatted.balance.amount).toBe('£123.45');
      expect(formatted.balance).not.toHaveProperty('error');
    });

    it('returns an error notification when unable to process balances data', () => {
      const formatted = createTransactionsResponseFrom('spends', {
        transactions: transactionApiResponse,
        balances: null,
      });

      expect(formatted.balance).not.toHaveProperty('amount');
      expect(formatted.balance.userNotification).toBeDefined();
    });

    it('sets the flag to display the damage obligations tab when there is money owed', () => {
      const formatted = createTransactionsResponseFrom('spends', {
        transactions: transactionApiResponse,
        balances: balancesApiResponse,
      });

      expect(formatted.shouldShowDamageObligationsTab).toBe(true);
    });

    it('sets the flag to not display the damage obligations tab when there is no money owed', () => {
      const formatted = createTransactionsResponseFrom('spends', {
        transactions: transactionApiResponse,
        balances: {
          ...balancesApiResponse,
          damageObligations: 0.0,
        },
      });

      expect(formatted.shouldShowDamageObligationsTab).toBe(false);
    });
  });

  describe('createDamageObligationsResponseFrom', () => {
    const damageObligations = [
      {
        amountPaid: 25,
        amountToPay: 50,
        comment: 'Some description',
        currency: 'GBP',
        endDateTime: '2021-03-15T11:49:58.502Z',
        id: 3,
        offenderNo: 'A1234BC',
        prison: 'Test (HMP)',
        referenceNumber: '841177/1, A841821/1, 842371',
        startDateTime: '2021-03-15T11:49:58.502Z',
        status: 'ACTIVE',
      },
      {
        amountPaid: 25,
        amountToPay: 50,
        comment: 'Some description',
        currency: 'GBP',
        endDateTime: '2021-02-15T11:49:58.502Z',
        id: 2,
        offenderNo: 'A1234BC',
        prison: 'Test (HMP)',
        referenceNumber: '841187/1, A842821/1, 843371',
        startDateTime: '2020-02-15T11:49:58.502Z',
        status: 'ACTIVE',
      },
    ];

    it('formats damage obligations data when present', () => {
      const formatted = createDamageObligationsResponseFrom(damageObligations);

      expect(formatted.rows).toEqual([
        [
          { text: '841177/1, A841821/1, 842371' },
          { text: '15 March 2021 to 15 March 2021' },
          { text: '£50.00' },
          { text: '£25.00' },
          { text: '£25.00' },
          { text: 'Test (HMP)' },
          { text: 'Some description' },
        ],
        [
          { text: '841187/1, A842821/1, 843371' },
          { text: '15 February 2020 to 15 February 2021' },
          { text: '£50.00' },
          { text: '£25.00' },
          { text: '£25.00' },
          { text: 'Test (HMP)' },
          { text: 'Some description' },
        ],
      ]);
    });

    it('filters out non-active damage obligations', () => {
      const withPaidObligations = [
        ...damageObligations,
        {
          amountPaid: 90,
          amountToPay: 90,
          comment: 'Some description',
          currency: 'GBP',
          endDateTime: '2021-01-15T11:49:58.502Z',
          id: 1,
          offenderNo: 'A1234BC',
          prison: 'Test (HMP)',
          referenceNumber: '841184/1, A848821/1, 849371',
          startDateTime: '2021-01-15T11:49:58.502Z',
          status: 'PAID',
        },
      ];

      const formatted = createDamageObligationsResponseFrom(
        withPaidObligations,
      );

      expect(formatted.rows).toEqual([
        [
          { text: '841177/1, A841821/1, 842371' },
          { text: '15 March 2021 to 15 March 2021' },
          { text: '£50.00' },
          { text: '£25.00' },
          { text: '£25.00' },
          { text: 'Test (HMP)' },
          { text: 'Some description' },
        ],
        [
          { text: '841187/1, A842821/1, 843371' },
          { text: '15 February 2020 to 15 February 2021' },
          { text: '£50.00' },
          { text: '£25.00' },
          { text: '£25.00' },
          { text: 'Test (HMP)' },
          { text: 'Some description' },
        ],
      ]);
    });

    it('creates a total for the outstanding damage obligation amount', () => {
      const formatted = createDamageObligationsResponseFrom(damageObligations);

      expect(formatted.totalRemainingAmount).toEqual('£50.00');
    });

    it('creates a total when there are no damage obligations', () => {
      const formatted = createDamageObligationsResponseFrom([]);

      expect(formatted.totalRemainingAmount).toEqual('£0.00');
    });

    it('returns an error notification when unable to process damage obligations data', () => {
      const formatted = createDamageObligationsResponseFrom();

      expect(formatted.userNotification).toBeDefined();
    });

    it('captures the exception in Sentry when an exception is thrown', () => {
      createDamageObligationsResponseFrom([undefined]);

      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });

  describe('createPendingTransactionsResponseFrom', () => {
    const transactionApiResponse = [
      {
        entryDate: '2021-03-28',
        transactionType: 'HOA',
        entryDescription: 'Pending 2',
        currency: 'GBP',
        penceAmount: 2500,
        accountType: 'REG',
        postingType: 'DR',
        agencyId: 'TST',
        prison: 'Test (HMP)',
        relatedOffenderTransactions: [],
        currentBalance: 0,
        holdingCleared: false,
      },
      {
        entryDate: '2021-03-29',
        transactionType: 'HOA',
        entryDescription: 'Pending 1',
        currency: 'GBP',
        penceAmount: 5000,
        accountType: 'REG',
        postingType: 'CR',
        agencyId: 'TST',
        prison: 'Test (HMP)',
        relatedOffenderTransactions: [],
        currentBalance: 0,
        holdingCleared: false,
      },
      {
        entryDate: '2021-03-27',
        transactionType: 'HOA',
        entryDescription: 'Pending 3',
        currency: 'GBP',
        penceAmount: 2500,
        accountType: 'REG',
        postingType: 'DR',
        agencyId: 'TST',
        prison: 'Test (HMP)',
        relatedOffenderTransactions: [],
        currentBalance: 0,
        holdingCleared: true,
      },
    ];

    it('formats pending transaction data', () => {
      const formatted = createPendingTransactionsResponseFrom(
        transactionApiResponse,
      );

      expect(formatted.rows).toEqual([
        [
          { text: '28 March 2021' },
          { text: '' },
          { text: '-£25.00' },
          { text: 'Pending 2' },
          { text: 'Test (HMP)' },
        ],
        [
          { text: '29 March 2021' },
          { text: '£50.00' },
          { text: '' },
          { text: 'Pending 1' },
          { text: 'Test (HMP)' },
        ],
      ]);
    });

    it('filters pending transactions where holding is cleared', () => {
      const formatted = createPendingTransactionsResponseFrom(
        transactionApiResponse,
      );

      expect(formatted.rows.length).toBe(2);
    });

    it('returns an error notification when unable to process pending transaction data', () => {
      const formatted = createPendingTransactionsResponseFrom();

      expect(formatted.userNotification).toBeDefined();
    });

    it('captures the exception in Sentry when an exception is thrown', () => {
      createPendingTransactionsResponseFrom([undefined]);

      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });
});
