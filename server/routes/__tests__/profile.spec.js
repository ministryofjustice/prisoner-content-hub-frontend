const request = require('supertest');
const cheerio = require('cheerio');

const { createProfileRouter } = require('../profile');
const { setupBasicApp } = require('../../../test/test-helpers');
const { User } = require('../../auth/user');

describe('GET /profile', () => {
  const offenderService = {
    getEventsForToday: jest.fn().mockResolvedValue({}),
    getIncentivesSummaryFor: jest.fn().mockResolvedValue({}),
    getVisitsFor: jest.fn().mockResolvedValue({}),
    getBalancesFor: jest.fn().mockResolvedValue({}),
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
    const router = createProfileRouter({ offenderService });
    app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });
    app.use(setMockUser);
    app.use('/profile', router);
    userSupplier.mockReturnValue(testUser);
  });

  it('prompts the user to sign in when they are signed out', () => {
    userSupplier.mockReturnValue(undefined);
    return request(app)
      .get('/profile')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .then(response => {
        const $ = cheerio.load(response.text);
        expect($('[data-test="signin-prompt"]').length).toBe(1);
      });
  });

  it('does not prompt the user to sign in when they are signed in', () =>
    request(app)
      .get('/profile')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .then(response => {
        const $ = cheerio.load(response.text);
        expect($('[data-test="signin-prompt"]').length).toBe(0);
      }));

  describe('Retrieve timetable information', () => {
    it('notifies the user when retrieving timetable information fails', () => {
      offenderService.getEventsForToday.mockResolvedValue({
        error: 'We are not able to show your timetable at this time',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="timetable-error"]').length).toBe(1);
        });
    });

    it('displays the timetable events when the user is signed in', () => {
      offenderService.getEventsForToday.mockResolvedValue({
        afternoon: {
          events: [
            {
              description: 'Art Class',
              endTime: '13:45PM',
              eventType: 'APP',
              finished: false,
              location: 'Studio workshop',
              paid: undefined,
              startTime: '13:10PM',
              status: 'SCH',
              timeString: '13:10PM to 13:45PM',
            },
          ],
          finished: true,
        },
        evening: {
          events: [
            {
              description: 'Case - Legal Aid',
              endTime: '10:45PM',
              eventType: 'APP',
              finished: false,
              location: 'Body repair',
              paid: undefined,
              startTime: '10:10PM',
              status: 'SCH',
              timeString: '10:10PM to 10:45PM',
            },
          ],
          finished: true,
        },
        morning: {
          events: [
            {
              description: 'Football',
              endTime: '10:45AM',
              eventType: 'APP',
              finished: false,
              location: 'Sports field',
              paid: undefined,
              startTime: '10:10AM',
              status: 'SCH',
              timeString: '10:10AM to 10:45AM',
            },
          ],
          finished: true,
        },
        title: 'Thursday 7 March',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="timetable-error"]').length).toBe(0);

          const eveningEvents = $('[data-test="eveningEvents"]').text();
          expect(eveningEvents).toContain('Case - Legal Aid');
          expect(eveningEvents).toContain('10:10pm to 10:45pm');
          expect(eveningEvents).toContain('Body repair');

          const afternoonEvents = $('[data-test="afternoonEvents"]').text();
          expect(afternoonEvents).toContain('Art Class');
          expect(afternoonEvents).toContain('13:10pm to 13:45pm');
          expect(afternoonEvents).toContain('Studio workshop');

          const morningEvents = $('[data-test="morningEvents"]').text();
          expect(morningEvents).toContain('Football');
          expect(morningEvents).toContain('10:10am to 10:45am');
          expect(morningEvents).toContain('Sports field');

          expect(
            $('[data-test="morningEvents"] [data-test="no-activities"]').length,
          ).toBe(0);
          expect(
            $('[data-test="afternoonEvents"] [data-test="no-activities"]')
              .length,
          ).toBe(0);
          expect(
            $('[data-test="eveningEvents"] [data-test="no-activities"]').length,
          ).toBe(0);
        });
    });

    it('displays no scheduled activities when there is no scheduled timetable events', () => {
      offenderService.getEventsForToday.mockResolvedValue({
        afternoon: { events: [], finished: true },
        evening: { events: [], finished: true },
        morning: { events: [], finished: true },
        title: 'Thursday 7 March',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="timetable-error"]').length).toBe(0);

          expect(
            $('[data-test="morningEvents"] [data-test="no-activities"]').length,
          ).toBe(1);
          expect(
            $('[data-test="afternoonEvents"] [data-test="no-activities"]')
              .length,
          ).toBe(1);
          expect(
            $('[data-test="eveningEvents"] [data-test="no-activities"]').length,
          ).toBe(1);
        });
    });

    it('displays the timetable link', () => {
      offenderService.getEventsForToday.mockResolvedValue({
        afternoon: { events: [], finished: true },
        evening: { events: [], finished: true },
        morning: { events: [], finished: true },
        title: 'Thursday 7 March',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('[data-test="timetableLink"] a').attr('href')).toBe(
            '/timetable',
          );
        });
    });
  });

  describe('Retrieve incentives information', () => {
    it('notifies the user when retrieving incentives information fails', () => {
      offenderService.getIncentivesSummaryFor.mockResolvedValue({
        error:
          'We are not able to show your incentive level summary at this time',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="incentives-error"]').length).toBe(1);
        });
    });

    it('displays the incentives information when the user is signed in', () => {
      offenderService.getIncentivesSummaryFor.mockResolvedValue({
        incentivesLevel: 'Basic',
        reviewDate: 'Thursday 8 June',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="incentives-error"]').length).toBe(0);

          const currentLevel = $('[data-test="currentLevel"]').text();
          expect(currentLevel).toContain('Basic');

          const reviewDate = $('[data-test="reviewDate"]').text();
          expect(reviewDate).toContain('Thursday 8 June');
        });
    });
    it('displays the incentives link', () =>
      request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('[data-test="incentivesLink"] a').attr('href')).toBe(
            '/incentives',
          );
        }));
  });

  describe('Retrieve visits information', () => {
    it('notifies the user when retrieving incentives information fails', () => {
      offenderService.getVisitsFor.mockResolvedValue({
        error: 'We are not able to show your visits information at this time',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="visits-error"]').length).toBe(1);
        });
    });

    it('displays the visits information when the user is signed in', () => {
      offenderService.getVisitsFor.mockResolvedValue({
        nextVisit: 'Tuesday 20 April 2021',
        visitType: 'Social',
        visitorName: '',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="visits-error"]').length).toBe(0);

          const nextVisit = $('[data-test="nextVisit"]').text();
          expect(nextVisit).toContain('Tuesday 20 April 2021');

          const visitType = $('[data-test="visitType"]').text();
          expect(visitType).toContain('Social');

          const visitorName = $('[data-test="visitorName"]').text();
          expect(visitorName).toContain('');
        });
    });
    it('displays the visit link', () =>
      request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('[data-test="visitsLink"] a').attr('href')).toBe('/visits');
        }));
  });

  describe('Retrieve money information', () => {
    it('notifies the user when retrieving money information fails', () => {
      offenderService.getBalancesFor.mockResolvedValue({
        error: 'We are not able to show your money and transactions at this time',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="money-error"]').length).toBe(1);
        });
    });

    it('displays the money information when the user is signed in', () => {
      offenderService.getBalancesFor.mockResolvedValue({
        spends: '£751.11',
        cash: '10.10',
        savings: '£10.10',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="money-error"]').length).toBe(0);

          const spends = $('[data-test="spends"]').text();
          expect(spends).toContain('£751.11');

          const cash = $('[data-test="private"]').text();
          expect(cash).toContain('10.10');

          const savings = $('[data-test="savings"]').text();
          expect(savings).toContain('£10.10');
        });
    });
    it('displays the money link', () =>
      request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('[data-test="moneyLink"] a').attr('href')).toBe('/money');
        }));
  });
});
