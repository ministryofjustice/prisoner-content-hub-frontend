import { activity, appointment } from '../mockApis/data';
import { daysFromNow } from '../support/step_definitions/utils';

describe('Timetable', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.task('stubPrimaryNavigation');
    cy.task('stubUrgentBanners');
    cy.task('stubBrowseAllTopics');
    cy.visit(`http://e2e.content-hub.localhost:3000/timetable`);
  });
  describe('When signed out', () => {
    it('displays the sign in link', () => {
      cy.log(cy.get('a'));
      cy.get('[data-test="signin-prompt"] > .govuk-link').contains('Sign in');
    });
  });
  describe('When signed in', () => {
    const locations = ['Locations 1', 'Locations 2', 'Locations 3'];
    const appointments = [
      'appointment 1',
      'appointment 2',
      'appointment 3',
      'appointment 4',
    ];
    const activities = ['activity 1', 'activity 2', 'activity 3', 'activity 4'];

    describe('Last week', () => {
      beforeEach(() => {
        const LAST_WEEK = daysFromNow(-7);
        const eventsLastWeek = [
          activity(LAST_WEEK, '10:00', '11:00', activities[3], locations[1]),
          activity(LAST_WEEK, '13:00', '14:00', activities[2], locations[3]),
          appointment(
            LAST_WEEK,
            '15:00',
            '16:00',
            appointments[3],
            locations[0],
          ),
          appointment(
            LAST_WEEK,
            '14:00',
            '16:00',
            appointments[1],
            locations[1],
          ),
        ];

        cy.task('stubEvents', eventsLastWeek);
        cy.task('stubPrisonerSignIn');
        cy.get('[data-test="signin-prompt"] > .govuk-link').click();
        cy.get('.timetable-header > .timetable-nav > a').first().click();
      });

      it('change the URL to include the expected path', () => {
        cy.url().should('include', '/timetable/lastweek');
      });

      it('displays timetable navigation links for last and this week in the timetable header section', () => {
        cy.get('.timetable-header > .timetable-nav > a').contains('This week');
        cy.get('.timetable-header > .timetable-nav > a').contains('Next week');
      });

      it("displays timetable 'Next week' text in the timetable header section", () => {
        cy.get('.timetable-header > .timetable-nav > span').contains(
          'Last week',
        );
      });

      it("displays timetable 'Next week' text in the timetable footer section", () => {
        cy.get('.timetable-footer > .timetable-nav > span').contains(
          'Last week',
        );
      });

      it('displays my timetable for last week', () => {
        cy.get('.timetable-day-blocks > div')
          .first()
          .find('.timetable-time')
          .contains('10.00am to 11.00am');

        cy.get('.timetable-day-blocks > div').first().contains(activities[3]);

        cy.get('.timetable-day-blocks > div').first().contains(locations[1]);
      });

      it("displays 'No activities' in my timetable when no activities or appointments are scheduled", () => {
        cy.get('.timetable-day-blocks > div').last().contains('No activities');
      });
    });

    describe('This week', () => {
      beforeEach(() => {
        const TOMORROW = daysFromNow(1);
        const TODAY = daysFromNow(0);

        const events = [
          activity(TODAY, '11:00', '12:00', activities[0], locations[0]),
          activity(TODAY, '12:00', '13:00', activities[1], locations[1]),
          activity(TODAY, '16:00', '17:00', activities[2], locations[2]),
          activity(TODAY, '17:00', '18:00', activities[3], locations[0]),
          appointment(
            TOMORROW,
            '11:00',
            '12:00',
            appointments[0],
            locations[1],
          ),
          appointment(
            TOMORROW,
            '12:00',
            '13:00',
            appointments[1],
            locations[2],
          ),
          appointment(
            TOMORROW,
            '16:00',
            '17:00',
            appointments[2],
            locations[0],
          ),
          appointment(
            TOMORROW,
            '17:00',
            '18:00',
            appointments[3],
            locations[2],
          ),
        ];

        cy.task('stubEvents', events);
        cy.task('stubPrisonerSignIn');
        cy.get('[data-test="signin-prompt"] > .govuk-link').click();
      });

      it('change the URL to include the expected path', () => {
        cy.url().should('include', '/timetable');
      });

      it('displays the expected page title in the timetable header section', () => {
        cy.get('.timetable-header > #title').contains('My timetable');
      });

      it("displays timetable 'This week' text in the timetable header section", () => {
        cy.get('.timetable-header > .timetable-nav > span').contains(
          'This week',
        );
      });

      it('displays timetable navigation links for last and next week in the timetable header section', () => {
        cy.get('.timetable-header > .timetable-nav > a').contains('Last week');
        cy.get('.timetable-header > .timetable-nav > a').contains('Next week');
      });

      it('displays the expected number of time of day headings', () => {
        cy.get('.timetable-day')
          .find('[data-test="time-of-day"]')
          .first()
          .children()
          .should('have.length', 3);
      });

      it('displays the expected time of day headings', () => {
        cy.get('.timetable-day')
          .find('[data-test="time-of-day"]')
          .first()
          .children()
          .first()
          .contains('Morning');

        cy.get('.timetable-day')
          .find('[data-test="time-of-day"]')
          .first()
          .children()
          .next()
          .contains('Afternoon');

        cy.get('.timetable-day')
          .find('[data-test="time-of-day"]')
          .first()
          .children()
          .last()
          .contains('Evening');
      });

      it('shows me my timetable', () => {
        const days = [
          {
            type: 'Today',
            period: '8.30am to 12.00pm',
            location: locations[0],
            event: activities[0],
          },
          {
            type: 'Today',
            period: '12.00pm to 5.00pm',
            location: locations[1],
            event: activities[1],
          },
          {
            type: 'Today',
            period: '12.00pm to 5.00pm',
            location: locations[2],
            event: activities[2],
          },
          {
            type: 'Today',
            period: '5.00pm to 7.30pm',
            location: locations[0],
            event: activities[3],
          },
          {
            type: 'Tomorrow',
            period: '8.30am to 12.00pm',
            location: locations[1],
            event: appointments[0],
          },
          {
            type: 'Tomorrow',
            period: '12.00pm to 5.00pm',
            location: locations[2],
            event: appointments[1],
          },
          {
            type: 'Tomorrow',
            period: '12.00pm to 5.00pm',
            location: locations[0],
            event: appointments[2],
          },
          {
            type: 'Tomorrow',
            period: '5.00pm to 7.30pm',
            location: locations[2],
            event: appointments[3],
          },
        ];
        days.forEach(({ type, period, event, location }) => {
          const section = cy
            .get(`[data-test="${type}"] [data-test="${period}"]`)
            .should('contain', event)
            .should('contain', location);
        });
      });

      it("displays timetable 'This week' text in the timetable footer section", () => {
        cy.get('.timetable-footer > .timetable-nav > span').contains(
          'This week',
        );
      });

      it('displays timetable navigation links for last and next week in the timetable footer section', () => {
        cy.get('.timetable-footer > .timetable-nav > a').contains('Last week');
        cy.get('.timetable-footer > .timetable-nav > a').contains('Next week');
      });

      it('displays the feedback widget', () => {
        cy.get('#feedback-widget').contains('Give us feedback');
      });
    });

    describe('Next week', () => {
      beforeEach(() => {
        const NEXT_WEEK = daysFromNow(7);
        const eventsNextWeek = [
          activity(NEXT_WEEK, '11:00', '12:00', activities[0], locations[0]),
          activity(NEXT_WEEK, '12:00', '13:00', activities[1], locations[1]),
          appointment(
            NEXT_WEEK,
            '16:00',
            '17:00',
            appointments[2],
            locations[0],
          ),
          appointment(
            NEXT_WEEK,
            '17:00',
            '18:00',
            appointments[3],
            locations[2],
          ),
        ];

        cy.task('stubEvents', eventsNextWeek);
        cy.task('stubPrisonerSignIn');
        cy.get('[data-test="signin-prompt"] > .govuk-link').click();
        cy.get('.timetable-header > .timetable-nav > a').last().click();
      });

      it('change the URL to include the expected path', () => {
        cy.url().should('include', '/timetable/nextweek');
      });

      it('displays timetable navigation links for last and this week in the timetable header section', () => {
        cy.get('.timetable-header > .timetable-nav > a').contains('Last week');
        cy.get('.timetable-header > .timetable-nav > a').contains('This week');
      });

      it('displays timetable navigation links for last and this week in the timetable footer section', () => {
        cy.get('.timetable-footer > .timetable-nav > a').contains('Last week');
        cy.get('.timetable-footer > .timetable-nav > a').contains('This week');
      });

      it("displays timetable 'Next week' text in the timetable header section", () => {
        cy.get('.timetable-header > .timetable-nav > span').contains(
          'Next week',
        );
      });

      it("displays timetable 'Next week' text in the timetable header section", () => {
        cy.get('.timetable-footer > .timetable-nav > span').contains(
          'Next week',
        );
      });

      it('displays my timetable for next week', () => {
        cy.get('.timetable-day-blocks > div')
          .first()
          .find('.timetable-time')
          .contains('11.00am to 12.00pm');

        cy.get('.timetable-day-blocks > div').first().contains(activities[0]);

        cy.get('.timetable-day-blocks > div').first().contains(locations[0]);
      });
    });
  });
});
