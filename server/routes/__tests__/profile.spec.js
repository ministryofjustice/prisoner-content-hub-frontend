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
    getVisitsRemaining: jest.fn().mockResolvedValue({}),
    getBalancesFor: jest.fn().mockResolvedValue({}),
  };

  const testUser = new User({
    prisonerId: 'A1234BC',
    firstName: 'Test',
    surname: 'User',
    bookingId: 1234567,
  });

  const userSupplier = jest.fn();
  const establishmentSupplier = jest.fn();

  let app;

  const setMockUser = (req, res, next) => {
    req.user = userSupplier();
    res.locals = establishmentSupplier();
    next();
  };

  beforeEach(() => {
    const router = createProfileRouter({ offenderService });
    app = setupBasicApp();
    app.use(setMockUser);
    app.use('/profile', router);
    userSupplier.mockReturnValue(testUser);
    establishmentSupplier.mockReturnValue({ establishmentName: 'wayland' });
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
        error: true,
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
              endTime: '13:45pm',
              eventType: 'APP',
              finished: false,
              location: 'Studio workshop',
              paid: undefined,
              startTime: '13:10pm',
              status: 'SCH',
              timeString: '13:10pm to 13:45pm',
            },
          ],
          finished: true,
        },
        evening: {
          events: [
            {
              description: 'Case - Legal Aid',
              endTime: '10:45pm',
              eventType: 'APP',
              finished: false,
              location: 'Body repair',
              paid: undefined,
              startTime: '10:10pm',
              status: 'SCH',
              timeString: '10:10pm to 10:45pm',
            },
          ],
          finished: true,
        },
        morning: {
          events: [
            {
              description: 'Football',
              endTime: '10:45am',
              eventType: 'APP',
              finished: false,
              location: 'Sports field',
              paid: undefined,
              startTime: '10:10am',
              status: 'SCH',
              timeString: '10:10am to 10:45am',
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
        error: true,
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
            '/content/4204',
          );
        }));
  });

  describe('Retrieve visits information', () => {
    it('visits are hidden for berwyn', () => {
      establishmentSupplier.mockReturnValue({ establishmentName: 'berwyn' });
      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="visits-container"]').length).toBe(0);
        });
    });

    it('visits are present for other establishments', () => {
      establishmentSupplier.mockReturnValue({
        establishmentName: 'anything else',
      });
      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="visits-container"]').length).toBe(1);
        });
    });

    it('notifies the user when retrieving visits fails', () => {
      offenderService.getVisitsFor.mockResolvedValue({
        error: true,
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
    it('notifies the user when retrieving visit balances fails', () => {
      offenderService.getVisitsRemaining.mockResolvedValue({
        error: true,
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

    describe('when the user is signed in and has visits', () => {
      let visitors;
      beforeEach(() => {
        visitors = ['Bob Visitor'];
        offenderService.getVisitsFor.mockResolvedValue({
          nextVisit: 'Tuesday 20 April 2021',
          visitType: 'Social',
          visitors,
          hasNextVisit: true,
        });
        offenderService.getVisitsRemaining.mockResolvedValue({
          visitsRemaining: 42,
        });
      });
      describe('with a single visitor', () => {
        let $;
        beforeEach(async () => {
          const response = await request(app).get('/profile');
          $ = cheerio.load(response.text);
        });
        it('does not display the visits error', () => {
          expect($('[data-test="visits-error"]').length).toBe(0);
        });
        it('shows the visits information', () => {
          const nextVisit = $('[data-test="nextVisit"]').text();
          expect(nextVisit).toContain('Tuesday 20 April 2021');
          expect(nextVisit).toContain('Social');
        });
        it('shows the visits remaining', () => {
          const visitsRemaining = $('[data-test="visitsRemaining"]').text();
          expect(visitsRemaining).toContain('42');
        });
        it('shows a single visitor', () => {
          const visitorName = $('[data-test="visitors"]').text();
          expect(visitorName).toContain('Bob Visitor');
        });
      });
      describe('with a multiple visitors', () => {
        let $;
        beforeEach(async () => {
          visitors.push('Pam Visitor');
          const response = await request(app).get('/profile');
          $ = cheerio.load(response.text);
        });
        it('shows a multiple visitors in a list', () => {
          expect($('[data-test="visitors"] ol li:first').text()).toBe(
            'Bob Visitor',
          );
          expect($('[data-test="visitors"] ol li:last').text()).toBe(
            'Pam Visitor',
          );
        });
      });
    });

    it('displays the no visits information when the user is signed in', () => {
      offenderService.getVisitsFor.mockResolvedValue({
        nextVisit: 'Tuesday 20 April 2021',
        visitType: 'Social',
        visitorName: 'Bob Visitor',
        hasNextVisit: false,
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="visits-error"]').length).toBe(0);

          const nextVisit = $('[data-test="nextVisit"]').text();
          expect(nextVisit).toContain('No upcoming visit');

          expect($('[data-test="visitType"]').length).toBe(0);
          expect($('[data-test="visitorName"]').length).toBe(0);
        });
    });

    it.skip('displays the visitors link', () =>
      request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('[data-test="approvedVisitors"] a').attr('href')).toBe(
            '/approved-visitors',
          );
        }));
    it('displays the visit link', () =>
      request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('[data-test="visitsLink"] a').attr('href')).toBe(
            '/content/4203',
          );
        }));
  });

  describe('Retrieve money information', () => {
    it('notifies the user when retrieving money information fails', () => {
      offenderService.getBalancesFor.mockResolvedValue({
        error: true,
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
        privateAccount: '10.10',
        savings: '£10.10',
      });

      return request(app)
        .get('/profile')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-test="money-error"]').length).toBe(0);

          const spends = $('[data-test="money-spends"]').text();
          expect(spends).toContain('£751.11');

          const privateAccount = $('[data-test="money-private"]').text();
          expect(privateAccount).toContain('10.10');

          const savings = $('[data-test="money-savings"]').text();
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

          expect($('[data-test="moneyLink"] a').attr('href')).toBe(
            '/money/transactions',
          );
        }));
  });
});
