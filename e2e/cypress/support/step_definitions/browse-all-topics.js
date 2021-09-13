import { And } from 'cypress-cucumber-preprocessor/steps';

And('I am presented with a selection of topics', () => {
  cy.get('.hub-topics > dl dt').its('length').should('be.gt', 0);
});
