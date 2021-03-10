const { formatTransactionPageData } = require('../formatters');

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
            calendarDate: '2021-03-08',
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
          paymentDescription: 'Test 2 from 8 March 2021',
          prison: 'HMP Test',
        },
        {
          balance: '£122.95',
          moneyIn: '£0.50',
          moneyOut: null,
          paymentDate: '8 March 2021',
          paymentDescription: 'Test 1 from 8 March 2021',
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
});
