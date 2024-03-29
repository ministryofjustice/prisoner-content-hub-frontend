import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { activity, appointment } from '../../mockApis/data';
import { horizontalTableToObject } from './utils';
import { format, addDays } from 'date-fns';
import { cy } from 'date-fns/locale';

Given(
  'that with an {string} content hub url, I request {string} page',
  (establishment, page) => {
    const establishmentString = establishment
      ? `${establishment.toLowerCase().replace(' ', '')}.`
      : '';
    cy.request(
      `http://${establishmentString}content-hub.localhost:3000/${page}`,
    ).as('requestResponse');
  },
);

Given('that I go to the Prisoner Content Hub for {string}', location => {
  cy.visit(
    `http://${location
      .toLowerCase()
      .replace(' ', '')}.content-hub.localhost:3000/`,
  );
});

Given(
  'that with an {string} content hub url, I go to the {string} page',
  (establishment, page) => {
    cy.task('stubPrimaryNavigation');
    cy.task('stubUrgentBanners');
    cy.task('stubBrowseAllTopics');
    const establishmentString = establishment
      ? `${establishment.toLowerCase().replace(' ', '')}.`
      : '';
    cy.visit(`http://${establishmentString}content-hub.localhost:3000/${page}`);
  },
);

Given('that I am viewing some content', () => {
  cy.visit('/');
  cy.get('.home-content a').first().click();
});

Given('that I go to the {string} page', val => {
  cy.task('stubPrimaryNavigation');
  cy.task('stubUrgentBanners');
  cy.task('stubBrowseAllTopics');
  cy.visit(`/${val}`);
});

Then('I am displayed the {string} link', siginIn => {
  cy.get('a').contains(siginIn).first();
});

Then('I am displayed the {string} link in {string}', (link, testContext) => {
  cy.get(`[data-test="${testContext}"] a`).contains(link).first();
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

const daysFromNow = n => format(addDays(new Date(), n), 'yyyy-MM-dd');

When('I have the following up coming events', args => {
  const rows = horizontalTableToObject(args);

  const events = rows.map(row => {
    const date = row.when === 'tomorrow' ? daysFromNow(1) : daysFromNow(0);
    return row.type === 'activity'
      ? activity(date, row.start, row.end, row.name, row.location)
      : appointment(date, row.start, row.end, row.name, row.location);
  });
  cy.task('stubEvents', events);
});
