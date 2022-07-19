describe('Healthcheck', () => {
  describe('All healthy', () => {
    beforeEach(() => {
      cy.task('reset');
    });

    it('Health check page is visible', () => {
      cy.request('/health').its('body.healthy').should('equal', true);
    });

    it('Health check page is visible', () => {
      cy.request('/health').its('body.healthy').should('equal', true);
    });

    it('Health/readiness is visible and UP', () => {
      cy.request('/health/readiness').its('body.status').should('equal', 'OK');
    });
  });
});
