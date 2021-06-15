import { Before, Then } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
  cy.task('reset');
});

Given('that I go to the {string} page', val => {
  cy.visit(`/${val}`);
});

Then('I am displayed the {string} link', siginIn => {
  cy.get('a').contains(siginIn).first();
});
