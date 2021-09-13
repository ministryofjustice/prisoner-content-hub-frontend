import { And, Then } from 'cypress-cucumber-preprocessor/steps';

And('select the Secondary Tag {string}', secondaryTagName => {
  cy.get('.hub-topics').contains(secondaryTagName).first().click();
});

Then('I am on the {string} page', secondaryTagName => {
  cy.get('h1').contains(secondaryTagName);
});

And('I see content for that Secondary Tag', () => {
  cy.get('.home-content__four-items a').its('length').should('be.gt', 0);
});
