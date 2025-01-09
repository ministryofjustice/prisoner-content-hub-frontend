describe('Healthcheck', () => {
  describe('All healthy', () => {
    beforeEach(() => {
      cy.task('reset');
    });

    it("'healthy' key/value pair is present with the expected value", () => {
      cy.request('/health').its('body.status').should('equal', 'UP');
    });

    it("'uptime' key/value pair is present with the expected value", () => {
      cy.request('/health').its('body.uptime').should('greaterThan', 0);
    });

    it('Health/readiness is visible and UP', () => {
      cy.request('/health/readiness').its('body.status').should('equal', 'UP');
    });
  });
});
