import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the request response contains a health status', response => {
  cy.get('@requestResponse').then(
    ({ body: { healthy, build, version, uptime } }) => {
      expect(healthy).to.equal(true);
      expect(uptime).to.be.greaterThan(0);
    },
  );
});
