import { When, And, Then } from 'cypress-cucumber-preprocessor/steps';

Then('my account balance information is not visible on the page', () => {
  cy.get('#money > .govuk-clearfix > :nth-child(1)').contains('Spends');
  cy.get('#money > .govuk-clearfix > :nth-child(2)').contains('Private');
  cy.get('#money > .govuk-clearfix > :nth-child(3)').contains('Savings');
});

Then('my account balance information is visible on the page', () => {
  cy.get('#balance-toggle-button');
});
