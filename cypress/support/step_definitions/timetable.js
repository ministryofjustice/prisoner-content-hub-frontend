import { And, Then } from 'cypress-cucumber-preprocessor/steps';

Then('I am displayed todays timetable', () => {
  cy.get('.todays-events > .govuk-body').contains(/.+/);
  cy.log('Timetable data has been passed through');
});

And('click the {string}', timetableLink => {
  cy.get('a').contains(timetableLink).first().click();
});
