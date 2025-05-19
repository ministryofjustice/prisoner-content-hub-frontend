describe('Profile', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.task('stubPrimaryNavigation');
    cy.task('stubUrgentBanners');
    cy.task('stubBrowseAllTopics');
    cy.visit(`http://etwoe.content-hub.localhost:3000/profile`);
  });

  describe('When signed in', () => {
    beforeEach(() => {
      const incentives = {
        iepLevel: 'Basic',
        iepDate: '2017-03-08',
      };

      cy.task('stubOffenderDetails');
      cy.task('stubIncentives', incentives);
      cy.task('stubPrisonerSignIn');
      cy.get('[data-test="signin-prompt"] > .govuk-link').click();
    });

    describe('Incentive level (IEP) section', () => {
      it('displays the expected section heading', () => {
        cy.get('[data-test="incentive-container"] > h2').should(
          'contain',
          'Incentives (IEP)',
        );
      });

      describe('Current incentive level panel', () => {
        it('displays the current incentive level panel', () => {
          cy.get('[data-test="currentLevel"]').should('exist');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="currentLevel"] > h3').should('exist');
          cy.get('[data-test="currentLevel"] > h3').should(
            'contain',
            'My current level:',
          );
        });

        it('displays the expected description', () => {
          cy.get('[data-test="currentLevel"] > p').should('contain', 'Basic');
        });
      });

      describe('Incentives link panel', () => {
        it('displays the incentives link panel', () => {
          cy.get('[data-test="incentivesLink"]').should('exist');
        });

        it('displays a link to read more about incentive levels', () => {
          cy.get('[data-test="incentivesLink"]').should('exist');
          cy.get('[data-test="incentivesLink"] > span').should(
            'contain',
            'Read more about incentives (IEP)',
          );
        });

        it("changes to the incentives page when the 'Read more about incentive levels' link is clicked", () => {
          cy.get('[data-test="incentivesLink"]').click();
          cy.url().should('include', '/tags/1417');
        });
      });
    });
  });
});
