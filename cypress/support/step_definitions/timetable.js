import { And, Then } from 'cypress-cucumber-preprocessor/steps';
import { horizontalTableToObject } from './utils';

Then('I am displayed todays timetable', () => {
  cy.get('.todays-events > .govuk-body').contains(/.+/);
  cy.log('Timetable data has been passed through');
});

Then('I am shown my time table', args => {
  const days = horizontalTableToObject(args);

  days.forEach(day => {
    ['8:30am to 12:00pm', '12:00pm to 5:00pm', '5:00pm to 7:30pm'].forEach(
      period => {
        const section = cy
          .get(`[data-test="${day.type}"]`)
          .find(`[data-test="${period}"]`);

        day[period]
          .split(',')
          .forEach(event => section.should('contain', event));
      },
    );
  });
});
