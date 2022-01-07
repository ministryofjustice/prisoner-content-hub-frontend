const request = require('supertest');
const cheerio = require('cheerio');
const FakeTimers = require('@sinonjs/fake-timers');

const {
  mockServer,
  success,
  failure,
  fiveOhThree,
} = require('../../../test/mockServer');
const { createMoneyRouter } = require('../money');
const PrisonerInformationService = require('../../services/prisonerInformation');
const PrisonApiRepository = require('../../repositories/prisonApi');
const { User } = require('../../auth/user');

const {
  setupBasicApp,
  consoleLogError,
} = require('../../../test/test-helpers');
const setCurrentUser = require('../../middleware/setCurrentUser');

const api = {
  transactionHistory: /\/transaction-history/i,
  pendingTransactions:
    /\/transaction-history\?account_code=cash&transaction_type=(HOA|WHF)/i,
  agencies: /\/agencies\/type\/INST\?activeOnly=false/i,
  balances: /\/balances/i,
  damageObligations: /\/damage-obligations/i,
};

describe('Prisoner Money', () => {
  let app;
  const client = { get: jest.fn() };
  const stubApiCalls = mockServer(client);
  const prisonApiRepository = new PrisonApiRepository({
    client,
    apiUrl: 'http://some-host/api',
  });
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
      description: 'Test (HMP)',
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

  const currentUser = jest.fn();
  const sessionSupplier = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    currentUser.mockReturnValue(testUser);
    sessionSupplier.mockReturnValue({ isSignedIn: true });

    app = setupBasicApp();
    app.use((req, res, next) => {
      req.user = currentUser();
      req.session = sessionSupplier();
      next();
    });
    app.use(setCurrentUser);
    app.use('/money', moneyRouter);
    app.use(consoleLogError);
  });

  describe('GET /money/transactions/spends', () => {
    beforeEach(() => {
      stubApiCalls([
        [api.transactionHistory, success(transactionApiResponse)],
        [api.agencies, success(agencyApiResponse)],
        [api.balances, success(balancesApiResponse)],
      ]);
    });

    it('prompts the user to sign in when they are signed out', async () => {
      currentUser.mockReturnValue(undefined);
      sessionSupplier.mockReturnValue({});

      await request(app)
        .get('/money/transactions/spends')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.govuk-body').text()).toMatch(/sign in/im);
        });
    });

    it('displays the transactions when the user is signed in', async () => {
      await request(app)
        .get('/money/transactions/spends')
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
          const firstTableRow = $('#transactions table tbody tr')
            .first()
            .text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('Test (HMP)');
        });
    });

    it('gracefully handles when there are no transactions to display', async () => {
      stubApiCalls([
        [api.transactionHistory, success([])],
        [api.balances, success(balancesApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/spends')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const tableRows = $('#transactions table tbody tr');
          expect(tableRows.length).toBe(0);
        });
    });

    it('does not show the damage obligations tab if there are none to display', async () => {
      stubApiCalls([
        [api.transactionHistory, success([])],
        [
          api.balances,
          success({
            ...balancesApiResponse,
            damageObligations: 0.0,
          }),
        ],
      ]);

      await request(app)
        .get('/money/transactions/spends')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should not display the damage obligations tab if there are none to display
          const tabs = $('.govuk-tabs__list-item').text();
          expect(tabs).not.toContain('Damage obligations');
        });
    });
    it('shows the damage obligations tab if there are some to display', async () => {
      await request(app)
        .get('/money/transactions/spends')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should display the damage obligations tab if there are some to display
          const tabs = $('.govuk-tabs__list-item').text();
          expect(tabs).toContain('Damage obligations');
        });
    });
    it('notifies the user when unable to fetch transaction data', async () => {
      stubApiCalls([
        [api.transactionHistory, failure(fiveOhThree)],
        [api.balances, success(balancesApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/spends')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const selectedPanel = $('.govuk-tabs__panel').text();
          // We should be presented with a notification that we are unable to show transactions...
          expect(selectedPanel).toMatch(/not able to show your transactions/im);
          // ...and allow the user to try again
          expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
        });
    });

    it('handles failures to the agency API gracefully', async () => {
      stubApiCalls([
        [api.transactionHistory, success(transactionApiResponse)],
        [api.agencies, failure(fiveOhThree)],
        [api.balances, success(balancesApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/spends')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should default to the spends account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Spends');
          const firstTableRow = $('#transactions table tbody tr')
            .first()
            .text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('TST');
        });
    });

    it('notifies the user when unable to fetch balance data', async () => {
      stubApiCalls([
        [api.transactionHistory, success(transactionApiResponse)],
        [api.agencies, success(agencyApiResponse)],
        [api.balances, failure(fiveOhThree)],
      ]);

      await request(app)
        .get('/money/transactions/spends')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should default to the spends account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Spends');
          // We should be presented with a notification that we are unable to show the balance...
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toMatch(
            /are not able to show your current balance/im,
          );
          // ...and allow the user to try again...
          expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
        });
    });

    it('allows the user to specify the month for transactions by passing a date', async () => {
      const spy = jest.spyOn(prisonerInformationService, 'getTransactionsFor');

      await request(app)
        .get('/money/transactions/spends?selectedDate=2021-12-01')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            'spends',
            new Date('2021-12-01T00:00:00.000'),
            new Date('2021-12-31T23:59:59.999'),
          );
        });
    });

    it('defaults to the current month when passed an invalid date', async () => {
      // Ideally we would use Jest's inbuilt methods for faking the clock, however we are using
      // Sinon's FakeTimer here because Jest's implementation does not appear to work with Async functions.

      // TODO: Remove @Sinon/fake-timers and use the Jest inbuilt method when the issue is resolved
      // jest
      //   .useFakeTimers('modern')
      //   .setSystemTime(new Date('2021-03-10T12:00:00.000').getTime());

      const clock = FakeTimers.install({
        now: new Date('2021-03-10T12:00:00.000'),
      });

      const spy = jest.spyOn(prisonerInformationService, 'getTransactionsFor');
      await request(app)
        .get('/money/transactions/spends?selectedDate=potato')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            'spends',
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      await request(app)
        .get('/money/transactions/spends?selectedDate=')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            'spends',
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      await request(app)
        .get('/money/transactions/spends?selectedDate=2021-02-31')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            'spends',
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      clock.uninstall();
    });
  });

  describe('GET /money/transactions/private', () => {
    beforeEach(() => {
      stubApiCalls([
        [api.pendingTransactions, success(pendingTransactionsApiResponse)],
        [api.transactionHistory, success(transactionApiResponse)],
        [api.agencies, success(agencyApiResponse)],
        [api.balances, success(balancesApiResponse)],
      ]);
    });

    it('prompts the user to sign in when they are signed out', async () => {
      currentUser.mockReturnValue(undefined);
      sessionSupplier.mockReturnValue({});
      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.govuk-body').text()).toMatch(/sign in/im);
        });
    });

    it('displays the transactions when the user is signed in', async () => {
      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be on the private (cash) account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Private');
          // We should be presented the balance
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£456.78');
          // We should be presented with the transactions
          const firstTableRow = $('#transactions table tbody tr')
            .first()
            .text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('Test (HMP)');
        });
    });

    it('gracefully handles when there are no transactions to display', async () => {
      stubApiCalls([
        [api.pendingTransactions, success(pendingTransactionsApiResponse)],
        [api.transactionHistory, success([])],
        [api.balances, success(balancesApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const tableRows = $('#transactions table tbody tr');
          expect(tableRows.length).toBe(0);
        });
    });

    it('shows pending transactions when there are some', async () => {
      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be presented the balance
          expect($('.transaction__balances li').text()).toContain('£456.78');
          // We should be presented with the pending transactions
          const pendingTransactions = $('#pending-transactions table tbody tr');
          expect(pendingTransactions.length).toBe(4);
          const firstPendingTransaction = pendingTransactions.first().text();
          expect(firstPendingTransaction).toContain('29 March 2021');
          expect(firstPendingTransaction).toContain('£50.00');
          expect(firstPendingTransaction).toContain('Pending 1');
          expect(firstPendingTransaction).toContain('Test (HMP)');
        });
    });

    it('shows the "Completed payments" title', async () => {
      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#completed-payments__heading h2').text()).toBe(
            'Completed payments',
          );
        });
    });

    describe('when there are no pending transactions', () => {
      beforeEach(() => {
        stubApiCalls([
          [api.balances, success(balancesApiResponse)],
          [api.pendingTransactions, success([])],
        ]);
      });
      it('does not show pending transactions', async () => {
        await request(app)
          .get('/money/transactions/private')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            // We should be presented the balance
            expect($('.transaction__balances li').text()).toContain('£456.78');
            // We should be presented with the pending transactions
            expect($('#pending-transactions').length).toBe(0);
          });
      });
      it('does not show the "Completed payments" title', async () => {
        await request(app)
          .get('/money/transactions/private')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('#completed-payments__heading h2').length).toBe(0);
          });
      });
    });

    describe('when unable to fetch pending transactions data', () => {
      beforeEach(() => {
        stubApiCalls([
          [api.pendingTransactions, failure(fiveOhThree)],
          [api.transactionHistory, success(transactionApiResponse)],
          [api.balances, success(balancesApiResponse)],
        ]);
      });
      it('notifies the user', async () => {
        await request(app)
          .get('/money/transactions/private')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            // We should be showing data for the private account
            const selectedTab = $('.govuk-tabs__list-item--selected').text();
            expect(selectedTab).toContain('Private');
            // We should be presented the balance
            expect($('.transaction__balances li').text()).toContain('£456.78');
            const selectedPanel = $('.govuk-tabs__panel').text();
            // We should be presented with a notification that we are unable to show pending transactions...
            expect(selectedPanel).toMatch(
              /not able to show information about pending payments/im,
            );
            // ...and allow the user to try again
            expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
          });
      });

      it('shows the "Completed payments" title', async () => {
        await request(app)
          .get('/money/transactions/private')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            expect($('#completed-payments__heading h2').text()).toBe(
              'Completed payments',
            );
          });
      });
    });

    it('does not show the damage obligations tab if there are none to display', async () => {
      stubApiCalls([
        [api.pendingTransactions, success(pendingTransactionsApiResponse)],
        [api.transactionHistory, success([])],
        [
          api.balances,
          success({
            ...balancesApiResponse,
            damageObligations: 0.0,
          }),
        ],
      ]);

      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should not display the damage obligations tab if there are none to display
          const tabs = $('.govuk-tabs__list-item').text();
          expect(tabs).not.toContain('Damage obligations');
        });
    });

    it('shows the damage obligations tab if there are some to display', async () => {
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
    it('notifies the user when unable to fetch transaction data', async () => {
      stubApiCalls([
        [api.pendingTransactions, success(pendingTransactionsApiResponse)],
        [api.transactionHistory, failure(fiveOhThree)],
        [api.balances, success(balancesApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const selectedPanel = $('.govuk-tabs__panel').text();
          // We should be presented with a notification that we are unable to show transactions...
          expect(selectedPanel).toMatch(/not able to show your transactions/im);
          // ...and allow the user to try again
          expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
        });
    });

    it('handles failures to the agency API gracefully', async () => {
      stubApiCalls([
        [api.pendingTransactions, success(pendingTransactionsApiResponse)],
        [api.transactionHistory, success(transactionApiResponse)],
        [api.balances, success(balancesApiResponse)],
        [api.agencies, failure(fiveOhThree)],
      ]);

      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const firstTableRow = $('#transactions table tbody tr')
            .first()
            .text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('TST');
        });
    });

    it('notifies the user when unable to fetch balance data', async () => {
      stubApiCalls([
        [api.pendingTransactions, success(pendingTransactionsApiResponse)],
        [api.transactionHistory, success(transactionApiResponse)],
        [api.balances, failure(fiveOhThree)],
        [api.agencies, success(agencyApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/private')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be presented with a notification that we are unable to show the balance...
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toMatch(
            /are not able to show your current balance/im,
          );
        });
    });

    it('allows the user to specify the month for transactions by passing a date', async () => {
      const spy = jest.spyOn(
        prisonerInformationService,
        'getPrivateTransactionsFor',
      );

      await request(app)
        .get('/money/transactions/private?selectedDate=2021-12-01')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            new Date('2021-12-01T00:00:00.000'),
            new Date('2021-12-31T23:59:59.999'),
          );
        });
    });

    it('defaults to the current month when passed an invalid date', async () => {
      // Ideally we would use Jest's inbuilt methods for faking the clock, however we are using
      // Sinon's FakeTimer here because Jest's implementation does not appear to work with Async functions.

      // TODO: Remove @Sinon/fake-timers and use the Jest inbuilt method when the issue is resolved
      // jest
      //   .useFakeTimers('modern')
      //   .setSystemTime(new Date('2021-03-10T12:00:00.000').getTime());

      const clock = FakeTimers.install({
        now: new Date('2021-03-10T12:00:00.000'),
      });

      const spy = jest.spyOn(
        prisonerInformationService,
        'getPrivateTransactionsFor',
      );
      await request(app)
        .get('/money/transactions/private?selectedDate=potato')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      await request(app)
        .get('/money/transactions/private?selectedDate=')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      await request(app)
        .get('/money/transactions/private?selectedDate=2021-02-31')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      clock.uninstall();
    });
  });

  describe('GET /money/transactions/savings', () => {
    beforeEach(() => {
      stubApiCalls([
        [api.transactionHistory, success(transactionApiResponse)],
        [api.balances, success(balancesApiResponse)],
        [api.agencies, success(agencyApiResponse)],
      ]);
    });

    it('prompts the user to sign in when they are signed out', async () => {
      sessionSupplier.mockReturnValue({});
      currentUser.mockReturnValue(undefined);
      await request(app)
        .get('/money/transactions/savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.govuk-body').text()).toMatch(/sign in/im);
        });
    });

    it('displays the transactions when the user is signed in', async () => {
      await request(app)
        .get('/money/transactions/savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be on the savings account
          const selectedTab = $('.govuk-tabs__list-item--selected').text();
          expect(selectedTab).toContain('Savings');
          // We should be presented the balance
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toContain('£890.12');
          // We should be presented with the transactions
          const firstTableRow = $('#transactions table tbody tr')
            .first()
            .text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('Test (HMP)');
        });
    });

    it('gracefully handles when there are no transactions to display', async () => {
      stubApiCalls([
        [api.transactionHistory, success([])],
        [api.balances, success(balancesApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const tableRows = $('#transactions table tbody tr');
          expect(tableRows.length).toBe(0);
        });
    });

    it('does not show the damage obligations tab if there are none to display', async () => {
      stubApiCalls([
        [api.transactionHistory, success([])],
        [
          api.balances,
          success({
            ...balancesApiResponse,
            damageObligations: 0.0,
          }),
        ],
      ]);

      await request(app)
        .get('/money/transactions/savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should not display the damage obligations tab if there are none to display
          const tabs = $('.govuk-tabs__list-item').text();
          expect(tabs).not.toContain('Damage obligations');
        });
    });

    it('shows the damage obligations tab if there are some to display', async () => {
      await request(app)
        .get('/money/transactions/savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should display the damage obligations tab if there are some to display
          const tabs = $('.govuk-tabs__list-item').text();
          expect(tabs).toContain('Damage obligations');
        });
    });

    it('notifies the user when unable to fetch transaction data', async () => {
      stubApiCalls([
        [api.transactionHistory, failure(fiveOhThree)],
        [api.balances, success(balancesApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const selectedPanel = $('.govuk-tabs__panel').text();
          // We should be presented with a notification that we are unable to show transactions...
          expect(selectedPanel).toMatch(/not able to show your transactions/im);
          // ...and allow the user to try again
          expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
        });
    });

    it('handles failures to the agency API gracefully', async () => {
      stubApiCalls([
        [api.transactionHistory, success(transactionApiResponse)],
        [api.balances, success(balancesApiResponse)],
        [api.agencies, failure(fiveOhThree)],
      ]);

      await request(app)
        .get('/money/transactions/savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const firstTableRow = $('#transactions table tbody tr')
            .first()
            .text();
          expect(firstTableRow).toContain('23 February 2021');
          expect(firstTableRow).toContain('£0.50');
          expect(firstTableRow).toContain('-£4.43');
          expect(firstTableRow).toContain('TST');
        });
    });

    it('notifies the user when unable to fetch balance data', async () => {
      stubApiCalls([
        [api.transactionHistory, success(transactionApiResponse)],
        [api.balances, failure(fiveOhThree)],
        [api.agencies, success(agencyApiResponse)],
      ]);

      await request(app)
        .get('/money/transactions/savings')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          // We should be presented with a notification that we are unable to show the balance...
          const selectedPanel = $('.govuk-tabs__panel').text();
          expect(selectedPanel).toMatch(
            /are not able to show your current balance/im,
          );
          // ...and allow the user to try again...
          expect($('.govuk-tabs__panel a').text()).toMatch(/try again/im);
        });
    });

    it('allows the user to specify the month for transactions by passing a date', async () => {
      const spy = jest.spyOn(prisonerInformationService, 'getTransactionsFor');

      await request(app)
        .get('/money/transactions/savings?selectedDate=2021-12-01')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            'savings',
            new Date('2021-12-01T00:00:00.000'),
            new Date('2021-12-31T23:59:59.999'),
          );
        });
    });

    it('defaults to the current month when passed an invalid date', async () => {
      // Ideally we would use Jest's inbuilt methods for faking the clock, however we are using
      // Sinon's FakeTimer here because Jest's implementation does not appear to work with Async functions.

      // TODO: Remove @Sinon/fake-timers and use the Jest inbuilt method when the issue is resolved
      // jest
      //   .useFakeTimers('modern')
      //   .setSystemTime(new Date('2021-03-10T12:00:00.000').getTime());

      const clock = FakeTimers.install({
        now: new Date('2021-03-10T12:00:00.000'),
      });

      const spy = jest.spyOn(prisonerInformationService, 'getTransactionsFor');
      await request(app)
        .get('/money/transactions/savings?selectedDate=potato')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            'savings',
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      await request(app)
        .get('/money/transactions/savings?selectedDate=')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            'savings',
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      await request(app)
        .get('/money/transactions/savings?selectedDate=2021-02-31')
        .expect(200)
        .then(() => {
          expect(spy).toHaveBeenCalledWith(
            testUser,
            'savings',
            new Date('2021-03-01T00:00:00.000'),
            new Date('2021-03-10T12:00:00.000'),
          );
        });

      clock.uninstall();
    });
  });

  describe('GET /money/damage-obligations', () => {
    it('prompts the user to sign in when they are signed out', async () => {
      sessionSupplier.mockReturnValue({});
      currentUser.mockReturnValue(undefined);
      await request(app)
        .get('/money/damage-obligations')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('.govuk-body').text()).toMatch(/sign in/im);
        });
    });

    it('displays damage obligations when the user is signed in', async () => {
      stubApiCalls([
        [api.damageObligations, success(damageObligationsApiResponse)],
        [api.agencies, success(agencyApiResponse)],
      ]);

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
          const table = $('#damage-obligations table tbody tr');
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
      stubApiCalls([
        [api.damageObligations, success({ damageObligations: [] })],
        [api.agencies, success(agencyApiResponse)],
      ]);

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
      stubApiCalls([
        [api.damageObligations, failure(fiveOhThree)],
        [api.agencies, success(agencyApiResponse)],
      ]);

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
