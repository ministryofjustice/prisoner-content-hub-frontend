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

      expect(formatted.transactions.length).toBe(1);
      expect(formatted.transactions[0]).toEqual({
        balance: '£123.45',
        moneyIn: '£0.50',
        moneyOut: null,
        paymentDate: '23 February 2021',
        paymentDescription: 'Television',
        prison: 'HMP Test',
      });
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

      expect(formatted.transactions.length).toBe(1);
      expect(formatted.transactions[0]).toEqual({
        balance: '£123.45',
        moneyIn: null,
        moneyOut: '-£0.50',
        paymentDate: '23 February 2021',
        paymentDescription: 'Television',
        prison: 'HMP Test',
      });
    });
    it('formats negative transactions when present', () => {
      const formatted = formatTransactionPageData('spends', {
        transactions: transactionApiResponse,
        balances: balancesApiResponse,
      });

      expect(formatted.transactions.length).toBe(1);
      expect(formatted.transactions[0]).toEqual({
        balance: '£123.45',
        moneyIn: null,
        moneyOut: '-£0.50',
        paymentDate: '23 February 2021',
        paymentDescription: 'Television',
        prison: 'HMP Test',
      });
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
