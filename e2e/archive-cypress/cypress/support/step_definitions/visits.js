import { When, And, Then } from 'cypress-cucumber-preprocessor/steps';

Then('my visits information is not visible on the page', () => {
  cy.get(':nth-child(1) > .govuk-clearfix > :nth-child(1)').contains(
    'Your next visit',
  );
  cy.get(':nth-child(1) > .govuk-clearfix > :nth-child(2)').contains(
    'Type of visit',
  );
  cy.get(':nth-child(1) > .govuk-clearfix > :nth-child(3)').contains(
    'Visitor name',
  );
});
