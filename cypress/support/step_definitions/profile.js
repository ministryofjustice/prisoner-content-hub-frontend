import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('that I go to the {string} page', () => {
  cy.visit('/profile');
});

Then('I am displayed the {string} link', siginIn => {
  cy.get('a').contains(siginIn).first();
});
