import { When, And, Then } from 'cypress-cucumber-preprocessor/steps';

Then('my Incentive level information is not visible on the page', () => {
  cy.get('#incentivesSummary > .govuk-clearfix > :nth-child(1)').contains(
    'Basic',
  );
  cy.get('#incentivesSummary > .govuk-clearfix > :nth-child(2)').contains(
    'Standard',
  );
  cy.get('#incentivesSummary > .govuk-clearfix > :nth-child(3)').contains(
    'Enhanced',
  );
});

Then('my Incentive level is displayed on the page', () => {
  cy.get('#incentivesSummary').contains('Your current incentive level');
  cy.get('#incentivesSummary').contains(
    'Your incentive level can be reviewed on',
  );
});
