import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('I see the {string} home page', location => {
  cy.get('.govuk-header').contains(location);
});
