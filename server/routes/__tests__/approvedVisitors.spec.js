const request = require('supertest');
const cheerio = require('cheerio');

const { createApprovedVisitorsRouter } = require('../approvedVisitors');
const { setupBasicApp } = require('../../../test/test-helpers');
const { User } = require('../../auth/user');

describe.skip('GET /approved-visitors', () => {
  const offenderService = {
    getApprovedVisitorsFor: jest.fn(),
  };

  const testUser = new User({
    prisonerId: 'A1234BC',
    firstName: 'Test',
    surname: 'User',
    bookingId: 1234567,
  });
  const userSupplier = jest.fn();
  let app;

  const setMockUser = (req, res, next) => {
    req.user = userSupplier();
    next();
  };

  beforeEach(() => {
    const router = createApprovedVisitorsRouter({ offenderService });
    app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });
    app.use(setMockUser);
    app.use('/approved-visitors', router);
    userSupplier.mockReturnValue(testUser);
    offenderService.getApprovedVisitorsFor.mockResolvedValue({
      approvedVisitors: ['Bob Test', 'Baz Test'],
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Sign in to the approved visitors page', () => {
    it('prompts the user to sign in when they are signed out', async () => {
      userSupplier.mockReturnValue(undefined);
      await request(app)
        .get('/approved-visitors')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="signin-prompt"]').length).toBe(1);
        });
    });

    it('does not prompt the user to sign in when they are signed in', () =>
      request(app)
        .get('/approved-visitors')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="signin-prompt"]').length).toBe(0);
        }));
  });

  describe('Retrieve approved visitors', () => {
    it('notifies the user when retrieving the approved visitors list fails', async () => {
      offenderService.getApprovedVisitorsFor.mockResolvedValue({
        error: true,
      });

      await request(app)
        .get('/approved-visitors')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="no-approved-visitors"]').length).toBe(0);
          expect($('[data-test="approved-visitors-list"]').length).toBe(0);
          expect($('[data-test="approved-visitors-error"]').length).toBe(1);
        });
    });
    it('notifies the user when there are no approved visitors', async () => {
      offenderService.getApprovedVisitorsFor.mockResolvedValue({
        approvedVisitors: [],
      });

      await request(app)
        .get('/approved-visitors')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="no-approved-visitors"]').length).toBe(1);
          expect($('[data-test="approved-visitors-list"]').length).toBe(0);
          expect($('[data-test="approved-visitors-error"]').length).toBe(0);
        });
    });
    it('displays the approved visitors', async () => {
      await request(app)
        .get('/approved-visitors')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="no-approved-visitors"]').length).toBe(0);
          expect($('[data-test="approved-visitors-list"]').length).toBe(1);
          expect($('[data-test="approved-visitors-error"]').length).toBe(0);
          expect($('.moj-pagination').length).toBe(0);
        });
    });
    describe('When pagination of approved visitors is required', () => {
      let firstPageVisitors;
      let secondPageVisitors;
      let thirdPageVisitors;
      const FIRST_PAGE_VISITOR = 'Andrew Test';
      const SECOND_PAGE_VISITOR = 'Cecil Test';
      const THIRD_PAGE_VISITOR = 'Lee Test';
      beforeEach(() => {
        firstPageVisitors = new Array(10).fill(FIRST_PAGE_VISITOR);
        secondPageVisitors = new Array(10).fill(SECOND_PAGE_VISITOR);
        thirdPageVisitors = new Array(4).fill(THIRD_PAGE_VISITOR);
        offenderService.getApprovedVisitorsFor.mockResolvedValue({
          approvedVisitors: [
            ...firstPageVisitors,
            ...secondPageVisitors,
            ...thirdPageVisitors,
          ],
        });
      });
      describe('the first page', () => {
        let $;
        beforeEach(async () => {
          $ = await request(app)
            .get('/approved-visitors?page=1')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .then(response => cheerio.load(response.text));
        });
        it('displays the first page of approved visitors', () => {
          const approvedVisitorsList = $(
            '[data-test="approved-visitors-list"] dd',
          );
          expect(approvedVisitorsList.length).toBe(firstPageVisitors.length);
          expect(approvedVisitorsList.first().text()).toContain(
            FIRST_PAGE_VISITOR,
          );
          expect(approvedVisitorsList.last().text()).toContain(
            FIRST_PAGE_VISITOR,
          );
        });
        it('displays the first page pagination', () => {
          const pagination = $('.moj-pagination');
          expect(pagination.find('.moj-pagination__item--prev').length).toBe(0);
          expect(pagination.find('.moj-pagination__item--next').length).toBe(1);
          expect(pagination.find('.moj-pagination__results').text()).toContain(
            'Showing 1 to 10 of 24',
          );
        });
      });
      it('defaults to display the first page of approved visitors', async () => {
        await request(app)
          .get('/approved-visitors?page=404')
          .expect(200)
          .expect('Content-Type', /text\/html/)
          .then(response => {
            const $ = cheerio.load(response.text);
            const approvedVisitorsList = $(
              '[data-test="approved-visitors-list"] dd',
            );
            expect(approvedVisitorsList.length).toBe(firstPageVisitors.length);
            expect(approvedVisitorsList.first().text()).toContain(
              FIRST_PAGE_VISITOR,
            );
            expect(approvedVisitorsList.last().text()).toContain(
              FIRST_PAGE_VISITOR,
            );
            expect();
          });
      });
      describe('the second page', () => {
        let $;
        beforeEach(async () => {
          $ = await request(app)
            .get('/approved-visitors?page=2')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .then(response => cheerio.load(response.text));
        });
        it('displays the second page of approved visitors', () => {
          const approvedVisitorsList = $(
            '[data-test="approved-visitors-list"] dd',
          );
          expect(approvedVisitorsList.length).toBe(secondPageVisitors.length);
          expect(approvedVisitorsList.first().text()).toContain(
            SECOND_PAGE_VISITOR,
          );
          expect(approvedVisitorsList.last().text()).toContain(
            SECOND_PAGE_VISITOR,
          );
        });
        it('displays the second page pagination', () => {
          const pagination = $('.moj-pagination');
          expect(pagination.find('.moj-pagination__item--prev').length).toBe(1);
          expect(pagination.find('.moj-pagination__item--next').length).toBe(1);
          expect(pagination.find('.moj-pagination__results').text()).toContain(
            'Showing 11 to 20 of 24',
          );
        });
      });
      describe('the third page', () => {
        let $;
        beforeEach(async () => {
          $ = await request(app)
            .get('/approved-visitors?page=3')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .then(response => cheerio.load(response.text));
        });
        it('displays the third page of approved visitors', () => {
          const approvedVisitorsList = $(
            '[data-test="approved-visitors-list"] dd',
          );
          expect(approvedVisitorsList.length).toBe(thirdPageVisitors.length);
          expect(approvedVisitorsList.first().text()).toContain(
            THIRD_PAGE_VISITOR,
          );
          expect(approvedVisitorsList.last().text()).toContain(
            THIRD_PAGE_VISITOR,
          );
        });
        it('displays the third page pagination', () => {
          const pagination = $('.moj-pagination');
          expect(pagination.find('.moj-pagination__item--prev').length).toBe(1);
          expect(pagination.find('.moj-pagination__item--next').length).toBe(0);
          expect(pagination.find('.moj-pagination__results').text()).toContain(
            'Showing 21 to 24 of 24',
          );
        });
      });
    });
  });
});
