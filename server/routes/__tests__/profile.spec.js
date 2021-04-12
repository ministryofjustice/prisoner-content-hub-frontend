const request = require('supertest');
const cheerio = require('cheerio');

const { createProfileRouter } = require('../profile');
const { setupBasicApp } = require('../../../test/test-helpers');
const { User } = require('../../auth/user');

describe('GET /profile', () => {
  const offenderService = {
    getEventsForToday: jest.fn(),
  };

  const testUser = new User({
    prisonerId: 'A1234BC',
    firstName: 'Test',
    surname: 'User',
    bookingId: 1234567,
  });

  const setMockUser = (req, res, next) => {
    req.user = testUser;
    next();
  };

  it('prompts the user to sign in when they are signed out', () => {
    const router = createProfileRouter({ offenderService });
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });

    app.use('/profile', router);

    return request(app)
      .get('/profile')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .then(response => {
        const $ = cheerio.load(response.text);
        expect($('[data-test="signin-prompt"]').length).toBe(1);
      });
  });

  it('does not prompt the user to sign in when they are signed in', () => {
    const router = createProfileRouter({ offenderService });
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });
    app.use(setMockUser);
    app.use('/profile', router);

    return request(app)
      .get('/profile')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .then(response => {
        const $ = cheerio.load(response.text);
        expect($('[data-test="signin-prompt"]').length).toBe(0);
      });
  });

  it('notifies the user when the service returns an error', () => {
    const router = createProfileRouter({ offenderService });
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });
    app.use(setMockUser);
    app.use('/profile', router);
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
    const router = createProfileRouter({ offenderService });
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });
    app.use(setMockUser);
    app.use('/profile', router);
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
          $('[data-test="afternoonEvents"] [data-test="no-activities"]').length,
        ).toBe(0);
        expect(
          $('[data-test="eveningEvents"] [data-test="no-activities"]').length,
        ).toBe(0);
      });
  });

  it('displays no scheduled activities when there is no scheduled timetable events', () => {
    const router = createProfileRouter({ offenderService });
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });
    app.use(setMockUser);
    app.use('/profile', router);
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
          $('[data-test="afternoonEvents"] [data-test="no-activities"]').length,
        ).toBe(1);
        expect(
          $('[data-test="eveningEvents"] [data-test="no-activities"]').length,
        ).toBe(1);
      });
  });
});
