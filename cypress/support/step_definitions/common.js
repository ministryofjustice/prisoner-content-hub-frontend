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

When('I click the {string} link', linkText => {
  cy.get('a').contains(linkText).click();
});

When('I click the {string} button', buttonText => {
  cy.get('.govuk-button').contains(buttonText).click();
});

Then('I am taken to the {string} page', pageTitle => {
  cy.get('h1').contains(pageTitle);
});
