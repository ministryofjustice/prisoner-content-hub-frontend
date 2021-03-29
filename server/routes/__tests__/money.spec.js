const request = require('supertest');
const cheerio = require('cheerio');
const createAxiosRequestError = require('axios/lib/core/createError');
const FakeTimers = require('@sinonjs/fake-timers');

const { createMoneyRouter } = require('../money');
const PrisonerInformationService = require('../../services/prisonerInformation');
const PrisonApiRepository = require('../../repositories/prisonApi');
const { User } = require('../../auth/user');

const {
  setupBasicApp,
  consoleLogError,
} = require('../../../test/test-helpers');

describe('Prisoner Money', () => {
  let app;
  const client = { get: jest.fn() };

  const prisonApiRepository = new PrisonApiRepository({ client });
  const prisonerInformationService = new PrisonerInformationService({
    prisonApiRepository,
  });
  const moneyRouter = createMoneyRouter({
    hubContentService: () => {},
    offenderService: () => {},
    prisonerInformationService,
  });

  const testUser = new User({
    prisonerId: 'A1234BC',
    firstName: 'Test',
    surname: 'User',
    bookingId: 1234567,
  });

  const transactionApiResponse = [
    {
      entryDate: '2021-02-23',
      transactionType: 'TELE',
      entryDescription: 'Television',
      currency: 'GBP',
      penceAmount: 50,
      accountType: 'SPND',
      postingType: 'DR',
      agencyId: 'TST',
      currentBalance: -443,
    },
  ];

  const pendingTransactionsApiResponse = [
    {
      entryDate: '2021-03-29',
      transactionType: 'HOA',
      entryDescription: 'Pending 1',
      currency: 'GBP',
      penceAmount: 5000,
      accountType: 'REG',
      postingType: 'CR',
      agencyId: 'TST',
      relatedOffenderTransactions: [],
      currentBalance: 0,
    },
    {
      entryDate: '2021-03-29',
      transactionType: 'HOA',
      entryDescription: 'Pending 2',
      currency: 'GBP',
      penceAmount: 2500,
      accountType: 'REG',
      postingType: 'DR',
      agencyId: 'TST',
      relatedOffenderTransactions: [],
      currentBalance: 0,
    },
  ];

  const agencyApiResponse = [
    {
      agencyId: 'TST',
      description: 'TEST (HMP)',
      formattedDescription: 'Test (HMP)',
    },
  ];

  const balancesApiResponse = {
    spends: 123.45,
    cash: 456.78,
    savings: 890.12,
    damageObligations: 50,
    currency: 'GBP',
  };

  const damageObligationsApiResponse = {
    damageObligations: [
      {
        amountPaid: 10,
        amountToPay: 50,
        comment: 'Damages to canteen furniture',
        currency: 'GBP',
        endDateTime: '2021-03-15T11:49:58.502Z',
        id: 3,
        offenderNo: 'A1234BC',
        prisonId: 'TST',
        referenceNumber: '841177/1, A841821/1, 842371',
        startDateTime: '2021-03-15T11:49:58.502Z',
        status: 'ACTIVE',
      },
      {
        amountPaid: 1570,
        amountToPay: 2000,
        comment: 'Some description',
        currency: 'GBP',
        endDateTime: '2021-02-15T11:49:58.502Z',
        id: 2,
        offenderNo: 'A1234BC',
        prisonId: 'TST',
        referenceNumber: '841187/1, A842821/1, 843371',
        startDateTime: '2020-02-15T11:49:58.502Z',
        status: 'ACTIVE',
      },
      {
        amountPaid: 90,
        amountToPay: 90,
        comment: 'Some description',
        currency: 'GBP',
        endDateTime: '2021-01-15T11:49:58.502Z',
        id: 1,
        offenderNo: 'A1234BC',
        prisonId: 'TST',
        referenceNumber: '841184/1, A848821/1, 849371',
        startDateTime: '2021-01-15T11:49:58.502Z',
        status: 'PAID',
      },
    ],
  };

  const fourOhFour = createAxiosRequestError('🤷‍♂️', null, 404);
  const fiveOhThree = createAxiosRequestError('💥', null, 503);

  const setMockUser = (req, res, next) => {
    req.user = testUser;
    next();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    app = setupBasicApp();
  });

  describe('GET /money/transactions', () => {
    it('prompts the user to sign in when they are signed out', async () => {
      app.use('/money', moneyRouter);

      await request(app)
        .get('/money/transactions')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.govuk-body').text()).toMatch(/sign in/im);
        });
    });

    it('displays the transactions when the user is signed in', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve(transactionApiResponse);
        }
        if (requestUrl.match(/\/agencies\/prison/i)) {
          return Promise.resolve(agencyApiResponse);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should default to the spends account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Spends');
          // We should be presented the balance
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£123.45');
          // We should be presented with the transactions
          const firstTableRow = $('#transactions tbody tr').first().text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('Test (HMP)');
        });
    });

    it('gracefully handles when there are no transactions to display', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve([]);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should default to the spends account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Spends');
          // We should be presented the balance
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£123.45');
        });
    });

    it('allow tabs to be selected', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve([]);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions?accountType=savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be on the private account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Savings');
          // We should be presented the balance
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£890.12');
        });
    });

    it('does not show the damage obligations tab if there are none to display', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve([]);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve({
            ...balancesApiResponse,
            damageObligations: 0.0,
          });
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should not display the damage obligations tab if there are none to display
          const tabs = $('.govuk-tabs__list-item').text();
          expect(tabs).not.toContain('Damage obligations');
        });
    });

    it('shows the damage obligations tab if there are some to display', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve([]);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should display the damage obligations tab if there are some to display
          const tabs = $('.govuk-tabs__list-item').text();
          expect(tabs).toContain('Damage obligations');
        });
    });

    it('default to "spends" when the selected tab is not valid', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return [];
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions?accountType=potato')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should default to the spends account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Spends');
          // We should be presented the balance
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£123.45');
        });
    });

    it('notifies the user when unable to fetch transaction data', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.reject(fiveOhThree);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should default to the spends account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Spends');
          // We should still be presented the balance
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£123.45');
          // We should be presented with a notification that we are unable to show transactions...
          expect(selectedPanel).toMatch(/not able to show your transactions/im);
          // ...and allow the user to try again
          expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
        });
    });

    it('handles failures to the agency API gracefully', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve(transactionApiResponse);
        }
        if (requestUrl.match(/\/agencies\/prison/i)) {
          return Promise.reject(fiveOhThree);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should default to the spends account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Spends');
          const firstTableRow = $('.govuk-table__body .govuk-table__row')
            .first()
            .text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('TST');
        });
    });

    it('notifies the user when unable to fetch balance data', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve(transactionApiResponse);
        }
        if (requestUrl.match(/\/agencies\/prison/i)) {
          return Promise.resolve(agencyApiResponse);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.reject(fiveOhThree);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should default to the spends account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Spends');
          // We should be presented with a notification that we are unable to show the balance...
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toMatch(/are not able to show your balance/im);
          // ...and allow the user to try again...
          expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
          // ..but should still be presented with the transactions
          const firstTableRow = $('.govuk-table__body .govuk-table__row')
            .first()
            .text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('Test (HMP)');
        });
    });

    it('shows pending transactions when on the "private" tab', async () => {
      client.get.mockImplementation(requestUrl => {
        if (
          requestUrl.match(
            /\/transaction-history\?account_code=cash&transaction_type=(HOA|WHF)/i,
          )
        ) {
          return Promise.resolve(pendingTransactionsApiResponse);
        }
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve(transactionApiResponse);
        }
        if (requestUrl.match(/\/agencies\/prison/i)) {
          return Promise.resolve(agencyApiResponse);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions?accountType=private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be showing data for the private account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Private');
          // We should be presented the balance
          const [balance, totalPending] = $('.transaction__balances li').get();
          expect($(balance).text()).toContain('£456.78');
          expect($(totalPending).text()).toContain('£50.00');
          // We should be presented with the pending transactions
          const pendingTransactions = $('#pending-transactions tbody tr');
          expect(pendingTransactions.length).toBe(4);
          const firstPendingTransaction = pendingTransactions.first().text();
          expect(firstPendingTransaction).toContain('29 March 2021');
          expect(firstPendingTransaction).toContain('£50.00');
          expect(firstPendingTransaction).toContain('Pending 1');
          expect(firstPendingTransaction).toContain('Test (HMP)');
        });
    });

    it('does not show pending transactions when not on the "private" tab', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve([]);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions?accountType=savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be on the savings account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Savings');
          // We not be show pending transactions
          const pendingTransactions = $('#pending-transactions').get();
          expect(pendingTransactions.length).toBe(0);
        });
    });

    it('notifies the user when unable to fetch pending transactions data', async () => {
      client.get.mockImplementation(requestUrl => {
        if (
          requestUrl.match(
            /\/transaction-history\?account_code=cash&transaction_type=(HOA|WHF)/i,
          )
        ) {
          return Promise.resolve(fiveOhThree);
        }
        if (requestUrl.match(/\/transaction-history/i)) {
          return Promise.resolve(transactionApiResponse);
        }
        if (requestUrl.match(/\/agencies\/prison/i)) {
          return Promise.resolve(agencyApiResponse);
        }
        if (requestUrl.match(/\/balances/i)) {
          return Promise.resolve(balancesApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions?accountType=private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be showing data for the private account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Private');
          // We should be presented the balance
          const [balance, totalPending] = $('.transaction__balances li').get();
          expect($(balance).text()).toContain('£456.78');
          expect(totalPending).toBeUndefined();
          // We should not be presented with the pending transactions
          const pendingTransactions = $('#pending-transactions').get();
          expect(pendingTransactions.length).toBe(0);
          const selectedPanel = $('.govuk-tabs__panel').text();
          // We should be presented with a notification that we are unable to show pending transactions...
          expect(selectedPanel).toMatch(
            /not able to show your pending payments/im,
          );
          // ...and allow the user to try again
          expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
        });
    });

    it('allows the user to specify the month for transactions by passing a date', async () => {
      const mockPrisonerInformationService = {
        getTransactionInformationFor: jest.fn(() => ({
          transactions: transactionApiResponse,
          balances: balancesApiResponse,
        })),
      };

      const mockedMoneyRouter = createMoneyRouter({
        hubContentService: {},
        offenderService: {},
        prisonerInformationService: mockPrisonerInformationService,
      });

      app.use(setMockUser);
      app.use('/money', mockedMoneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions?selectedDate=2021-01-01')
        .expect(200)
        .then(() => {
          expect(
            mockPrisonerInformationService.getTransactionInformationFor,
          ).toHaveBeenCalledWith(
            testUser,
            'spends',
            new Date('2021-01-01T00:00:00.000Z'),
            new Date('2021-01-31T23:59:59.999Z'),
          );
        });
    });

    it('defaults to the current month when passed an invalid date', async () => {
      // Ideally we would use Jest's inbuilt methods for faking the clock, however we are using
      // Sinon's FakeTimer here because Jest's implementation does not appear to work with Async functions.

      // TODO: Remove @Sinon/fake-timers and use the Jest inbuilt method when the issue is resolved
      // jest
      //   .useFakeTimers('modern')
      //   .setSystemTime(new Date('2021-03-10T12:00:00.000Z').getTime());

      const clock = FakeTimers.install({
        now: new Date('2021-03-10T12:00:00.000Z'),
      });

      const mockPrisonerInformationService = {
        getTransactionInformationFor: jest.fn(() => ({
          transactions: transactionApiResponse,
          balances: balancesApiResponse,
        })),
      };

      const mockedMoneyRouter = createMoneyRouter({
        hubContentService: {},
        offenderService: {},
        prisonerInformationService: mockPrisonerInformationService,
      });

      app.use(setMockUser);
      app.use('/money', mockedMoneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/transactions?selectedDate=potato')
        .expect(200)
        .then(() => {
          expect(
            mockPrisonerInformationService.getTransactionInformationFor,
          ).toHaveBeenCalledWith(
            testUser,
            'spends',
            new Date('2021-03-01T00:00:00.000Z'),
            new Date('2021-03-10T12:00:00.000Z'),
          );
        });

      await request(app)
        .get('/money/transactions?selectedDate=')
        .expect(200)
        .then(() => {
          expect(
            mockPrisonerInformationService.getTransactionInformationFor,
          ).toHaveBeenCalledWith(
            testUser,
            'spends',
            new Date('2021-03-01T00:00:00.000Z'),
            new Date('2021-03-10T12:00:00.000Z'),
          );
        });

      await request(app)
        .get('/money/transactions?selectedDate=2021-02-31')
        .expect(200)
        .then(() => {
          expect(
            mockPrisonerInformationService.getTransactionInformationFor,
          ).toHaveBeenCalledWith(
            testUser,
            'spends',
            new Date('2021-03-01T00:00:00.000Z'),
            new Date('2021-03-10T12:00:00.000Z'),
          );
        });

      clock.uninstall();
    });
  });

  describe('GET /money/damage-obligations', () => {
    it('prompts the user to sign in when they are signed out', async () => {
      app.use('/money', moneyRouter);

      await request(app)
        .get('/money/damage-obligations')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.govuk-body').text()).toMatch(/sign in/im);
        });
    });

    it('displays damage obligations when the user is signed in', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/damage-obligations/i)) {
          return Promise.resolve(damageObligationsApiResponse);
        }
        if (requestUrl.match(/\/agencies\/prison/i)) {
          return Promise.resolve(agencyApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/damage-obligations')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should have the damage obligations tab selected
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Damage obligations');
          // We should be presented the total amount for damage obligations
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£470.00');
          // We should be presented with the damage obligation data
          const table = $('#damage-obligations tbody tr');
          expect(table.length).toEqual(2);
          const firstTableRow = table.first().text();
          expect(firstTableRow).toContain('841177/1, A841821/1, 842371');
          expect(firstTableRow).toContain('15 March 2021 to 15 March 2021');
          expect(firstTableRow).toContain('£50.00');
          expect(firstTableRow).toContain('£10.00');
          expect(firstTableRow).toContain('£40.00');
          expect(firstTableRow).toContain('Test (HMP)');
          expect(firstTableRow).toContain('Damages to canteen furniture');
        });
    });
    it('gracefully handles when there are no damage obligations to display', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/damage-obligations/i)) {
          return Promise.resolve({ damageObligations: [] });
        }
        if (requestUrl.match(/\/agencies\/prison/i)) {
          return Promise.resolve(agencyApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/damage-obligations')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should have the damage obligations tab selected
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Damage obligations');
          // We should be presented the total amount for damage obligations
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£0.00');
        });
    });
    it('notifies the user when unable to fetch damage obligations', async () => {
      client.get.mockImplementation(requestUrl => {
        if (requestUrl.match(/\/damage-obligations/i)) {
          return Promise.reject(fiveOhThree);
        }
        if (requestUrl.match(/\/agencies\/prison/i)) {
          return Promise.resolve(agencyApiResponse);
        }
        return Promise.reject(fourOhFour);
      });

      app.use(setMockUser);
      app.use('/money', moneyRouter);
      app.use(consoleLogError);

      await request(app)
        .get('/money/damage-obligations')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should have the damage obligations tab selected
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Damage obligations');
          const selectedPanel = $('.govuk-tabs__panel').text();
          // We should be presented with a notification that we are unable to show transactions...
          expect(selectedPanel).toMatch(
            /not able to show your damage obligations/im,
          );
        });
    });
  });
});
