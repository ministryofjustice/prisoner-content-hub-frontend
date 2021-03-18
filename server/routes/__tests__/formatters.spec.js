const {
  formatTransactionPageData,
  formatDamageObligations,
} = require('../formatters');

describe('Responses', () => {
  describe('formatTransactionPageData', () => {
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
      currency: 'GBP',
    };

    it('formats positive transactions when present', () => {
      const formatted = formatTransactionPageData('spends', {
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

      expect(formatted.transactions).toEqual([
        {
          balance: '£123.45',
          moneyIn: '£0.50',
          moneyOut: null,
          paymentDate: '23 February 2021',
          paymentDescription: 'Television',
          prison: 'HMP Test',
        },
      ]);
    });

    it('formats negative transactions when present', () => {
      const formatted = formatTransactionPageData('spends', {
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

      expect(formatted.transactions).toEqual([
        {
          balance: '£123.45',
          moneyIn: null,
          moneyOut: '-£0.50',
          paymentDate: '23 February 2021',
          paymentDescription: 'Television',
          prison: 'HMP Test',
        },
      ]);
    });

    it('formats related transactions when present', () => {
      const formatted = formatTransactionPageData('spends', {
        transactions: relatedTransactions,
        balances: balancesApiResponse,
      });

      expect(formatted.transactions).toEqual([
        {
          balance: '£122.95',
          moneyIn: null,
          moneyOut: '-£0.50',
          paymentDate: '9 March 2021',
          paymentDescription: 'Television',
          prison: 'HMP Test',
        },
        {
          balance: '£123.45',
          moneyIn: '£0.50',
          moneyOut: null,
          paymentDate: '8 March 2021',
          paymentDescription: 'Test 1 from 8 March 2021',
          prison: 'HMP Test',
        },
        {
          balance: '£122.95',
          moneyIn: '£0.50',
          moneyOut: null,
          paymentDate: '8 March 2021',
          paymentDescription: 'Test 2 from 7 March 2021',
          prison: 'HMP Test',
        },
      ]);
    });

    it('returns an error notification when present for transactions', () => {
      const formatted = formatTransactionPageData('spends', {
        transactions: { error: '💥' },
        balances: balancesApiResponse,
      });

      expect(formatted.transactions.error).toBe('💥');
    });

    it('formats balance data when present', () => {
      const formatted = formatTransactionPageData('spends', {
        transactions: transactionApiResponse,
        balances: balancesApiResponse,
      });

      expect(formatted.balance.amount).toBe('£123.45');
      expect(formatted.balance).not.toHaveProperty('error');
    });

    it('returns an error notification when present for balances', () => {
      const formatted = formatTransactionPageData('spends', {
        transactions: transactionApiResponse,
        balances: { error: '💥' },
      });

      expect(formatted.balance).not.toHaveProperty('amount');
      expect(formatted.balance.error).toBe('💥');
    });
  });

  describe('formatDamageObligations', () => {
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
      const formatted = formatDamageObligations(damageObligations);

      expect(formatted.rows).toEqual([
        {
          adjudicationNumber: '841177/1, A841821/1, 842371',
          timePeriod: '15 March 2021 to 15 March 2021',
          totalAmount: '£50.00',
          amountPaid: '£25.00',
          amountOwed: '£25.00',
          prison: 'Test (HMP)',
          description: 'Some description',
        },
        {
          adjudicationNumber: '841187/1, A842821/1, 843371',
          timePeriod: '15 February 2020 to 15 February 2021',
          totalAmount: '£50.00',
          amountPaid: '£25.00',
          amountOwed: '£25.00',
          prison: 'Test (HMP)',
          description: 'Some description',
        },
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

      const formatted = formatDamageObligations(withPaidObligations);

      expect(formatted.rows).toEqual([
        {
          adjudicationNumber: '841177/1, A841821/1, 842371',
          timePeriod: '15 March 2021 to 15 March 2021',
          totalAmount: '£50.00',
          amountPaid: '£25.00',
          amountOwed: '£25.00',
          prison: 'Test (HMP)',
          description: 'Some description',
        },
        {
          adjudicationNumber: '841187/1, A842821/1, 843371',
          timePeriod: '15 February 2020 to 15 February 2021',
          totalAmount: '£50.00',
          amountPaid: '£25.00',
          amountOwed: '£25.00',
          prison: 'Test (HMP)',
          description: 'Some description',
        },
      ]);
    });

    it('creates a total for the outstanding damage obligation amount', () => {
      const formatted = formatDamageObligations(damageObligations);

      expect(formatted.totalRemainingAmount).toEqual('£50.00');
    });

    it('creates a total when there are no damage obligations', () => {
      const formatted = formatDamageObligations([]);

      expect(formatted.totalRemainingAmount).toEqual('£0.00');
    });

    it('returns the error notification when present', () => {
      const formatted = formatDamageObligations({ error: '💥' });

      expect(formatted.error).toEqual('💥');
    });
  });
});
