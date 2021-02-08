import { When, And, Then } from 'cypress-cucumber-preprocessor/steps';

const testComment = 'Something constructive';

When('I click the Like button', () => {
  cy.get('.govuk-hub-thumbs--up').click();

  cy.window()
    .its('_feedback')
    .should('have.deep.property', 'sentiment', 'LIKE');
});

When('I click the Dislike button', () => {
  cy.get('.govuk-hub-thumbs--down').click();

  cy.window()
    .its('_feedback')
    .should('have.deep.property', 'sentiment', 'DISLIKE');
});

And('I leave a comment', () => {
  cy.get('.govuk-textarea').type(testComment);
});

Then('my feedback is submitted', () => {
  ['id', 'title', 'url', 'contentType'].forEach(property => {
    cy.window().its('_feedback').should('have.property', property);
  });

  cy.window()
    .its('_feedback')
    .should('have.deep.property', 'comment', testComment);
});
