import { And, Then } from 'cypress-cucumber-preprocessor/steps';

And('select the Secondary Tag {string}', topicName => {
  cy.get('.hub-topics').contains(topicName).first().click();
});

Then('I am on the {string} page', topicName => {
  cy.get('h1').contains(topicName);
});

And('I see content for that Secondary Tag', () => {
  cy.get('.content__four-items a').its('length').should('be.gt', 0);
});
