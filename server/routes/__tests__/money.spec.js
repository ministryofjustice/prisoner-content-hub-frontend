const request = require('supertest');
const cheerio = require('cheerio');
const createAxiosRequestError = require('axios/lib/core/createError');

const { createMoneyRouter } = require('../money');
const {
  createPrisonApiOffenderService: createPrisonApiService,
} = require('../../services/offender');
const {
  offenderRepository: createPrisonApiRepository,
} = require('../../repositories/offender');
const { User } = require('../../auth/user');

const {
  setupBasicApp,
  consoleLogError,
} = require('../../../test/test-helpers');

describe('GET /money/transactions', () => {
  let app;
  const mockClient = { get: jest.fn() };

  const offenderRepository = createPrisonApiRepository(mockClient);
  const offenderService = createPrisonApiService(offenderRepository);
  const moneyRouter = createMoneyRouter({
    hubContentService: () => {},
    offenderService,
  });

  const testUser = new User({
    prisonerId: 'PRISONER_ID',
    firstName: 'Test',
    surname: 'User',
    bookingId: 'BOOKING_ID',
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

  const agencyApiResponse = {
    agencyId: 'TST',
    description: 'Test (HMP)',
    longDescription: 'HMP TEST',
  };

  const balancesApiResponse = {
    spends: 123.45,
    cash: 456.78,
    savings: 890.12,
    currency: 'GBP',
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

  it('should prompt to sign in when the user is signed out', async () => {
    app.use('/money', moneyRouter);

    await request(app)
      .get('/money/transactions')
      .expect(200)
      .then(response => {
        const $ = cheerio.load(response.text);
        expect($('.govuk-body').text()).toMatch(/sign in/im);
      });
  });

  it('should display the transactions when the user is signed in', async () => {
    mockClient.get.mockImplementation(requestUrl => {
      if (requestUrl.match(/\/transaction-history/i)) {
        return Promise.resolve(transactionApiResponse);
      }
      if (requestUrl.match(/\/agencies\/TST/i)) {
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
        const firstTableRow = $('.govuk-table__body .govuk-table__row')
          .first()
          .text();
        expect(firstTableRow).toContain('23 February 2021');
        expect(firstTableRow).toContain('£0.50');
        expect(firstTableRow).toContain('-£4.43');
        expect(firstTableRow).toContain('HMP Test');
      });
  });

  it('should handle when there are no transactions to display', async () => {
    mockClient.get.mockImplementation(requestUrl => {
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

  it('should allow tabs to be selected', async () => {
    mockClient.get.mockImplementation(requestUrl => {
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
      .get('/money/transactions?accountType=private')
      .expect(200)
      .then(response => {
        const $ = cheerio.load(response.text);
        // We should be on the private account
        const selectedTab = $('.govuk-tabs__list-item--selected').text();
        expect(selectedTab).toContain('Private');
        // We should be presented the balance
        const selectedPanel = $('.govuk-tabs__panel').text();
        expect(selectedPanel).toContain('£456.78');
      });
  });

  it('should default when the selected tab is not valid', async () => {
    mockClient.get.mockImplementation(requestUrl => {
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

  it('should notify the user when unable to fetch transaction data', async () => {
    mockClient.get.mockImplementation(requestUrl => {
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

  it('should handle failures to the agency API gracefully', async () => {
    mockClient.get.mockImplementation(requestUrl => {
      if (requestUrl.match(/\/transaction-history/i)) {
        return Promise.resolve(transactionApiResponse);
      }
      if (requestUrl.match(/\/agencies\/TST/i)) {
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

  it('should notify the user when unable to fetch balance data', async () => {
    mockClient.get.mockImplementation(requestUrl => {
      if (requestUrl.match(/\/transaction-history/i)) {
        return Promise.resolve(transactionApiResponse);
      }
      if (requestUrl.match(/\/agencies\/TST/i)) {
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
        expect(firstTableRow).toContain('HMP Test');
      });
  });
});
