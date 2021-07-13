import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('that I go to the Prisoner Content Hub for {string}', location => {
  cy.visit(
    `http://${location
      .toLowerCase()
      .replace(' ', '')}.prisoner-content-hub.local:3000/`,
  );
});

Given('that I am viewing some content', () => {
  cy.visit('/');
  cy.get('.home-content a').first().click();
});

Given('that I go to the {string} page', val => {
  cy.visit(`/${val}`);
});

Then('I am displayed the {string} link', siginIn => {
  cy.get('a').contains(siginIn).first();
});

When('I click the {string} link', linkText => {
  cy.get('a').contains(linkText).click();
});

When('I click the {string} button', buttonText => {
  cy.get('.govuk-button').contains(buttonText).click();
});

Then('I am taken to the {string} page', pageTitle => {
  cy.get('h1').contains(pageTitle);
});

Then('I am on the {string} page', personalizationPage => {
  cy.get('h1').contains(personalizationPage);
});

And('I see related content for that category', () => {
  cy.get('[data-featured-id]').its('length').should('be.gt', 0);
});

And('I log into the hub', () => {
  cy.task('stubPrisonerSignIn');
  cy.get('[data-test="signin-prompt"] > .govuk-link').click();
});
