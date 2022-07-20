import { last } from 'ramda';
import { activity, appointment } from '../mockApis/data';
import { daysFromNow } from '../support/step_definitions/utils';

describe('Timetable', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.task('stubPrimaryNavigation');
    cy.task('stubBrowseAllTopics');
    cy.visit(`http://cookhamwood.content-hub.localhost:3000/timetable`);
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
    beforeEach(() => {
      const TOMORROW = daysFromNow(1);
      const TODAY = daysFromNow(0);
      const events = [
        activity(TODAY, '11:00', '12:00', activities[0], locations[0]),
        activity(TODAY, '12:00', '13:00', activities[1], locations[1]),
        activity(TODAY, '16:00', '17:00', activities[2], locations[2]),
        activity(TODAY, '17:00', '18:00', activities[3], locations[0]),
        appointment(TOMORROW, '11:00', '12:00', appointments[0], locations[1]),
        appointment(TOMORROW, '12:00', '13:00', appointments[1], locations[2]),
        appointment(TOMORROW, '16:00', '17:00', appointments[2], locations[0]),
        appointment(TOMORROW, '17:00', '18:00', appointments[3], locations[2]),
      ];
      cy.task('stubEvents', events);
      cy.task('stubPrisonerSignIn');
      cy.get('[data-test="signin-prompt"] > .govuk-link').click();
    });

    it('displays the expected page title', () => {
      cy.get('#title').contains('Timetable');
    });

    it("displays timetable 'This week' text", () => {
      cy.get('.timetable-nav > span').contains('This week');
    });

    it('displays timetable navigation links for last and next week', () => {
      cy.get('.timetable-nav > a').contains('Last week');
      cy.get('.timetable-nav > a').contains('Next week');
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
          period: '8:30am to 12:00pm',
          location: locations[0],
          event: activities[0],
        },
        {
          type: 'Today',
          period: '12:00pm to 5:00pm',
          location: locations[1],
          event: activities[1],
        },
        {
          type: 'Today',
          period: '12:00pm to 5:00pm',
          location: locations[2],
          event: activities[2],
        },
        {
          type: 'Today',
          period: '5:00pm to 7:30pm',
          location: locations[0],
          event: activities[3],
        },
        {
          type: 'Tomorrow',
          period: '8:30am to 12:00pm',
          location: locations[1],
          event: appointments[0],
        },
        {
          type: 'Tomorrow',
          period: '12:00pm to 5:00pm',
          location: locations[2],
          event: appointments[1],
        },
        {
          type: 'Tomorrow',
          period: '12:00pm to 5:00pm',
          location: locations[0],
          event: appointments[2],
        },
        {
          type: 'Tomorrow',
          period: '5:00pm to 7:30pm',
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
  });
});
