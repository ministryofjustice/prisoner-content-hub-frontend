import { Before, And, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
  cy.task('reset');
});

Given('that I go to the {string} page', val => {
  cy.visit(`/${val}`);
});

Then('I am displayed the {string} link', siginIn => {
  cy.get('a').contains(siginIn).first();
});

When('I am logged in to the hub', () => {
  cy.task('stubPrisonerSignIn');
  cy.task('stubEvents');
  cy.get('[data-test="signin-prompt"] > .govuk-link').click();
});

Then('I am shown my time table', () => {
  // TODO: Verify stuff
});
