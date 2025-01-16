describe('Profile', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.task('stubPrimaryNavigation');
    cy.task('stubUrgentBanners');
    cy.task('stubBrowseAllTopics');
    cy.visit(`http://e2e.content-hub.localhost:3000/profile`);
  });
  describe('When signed out', () => {
    it('displays the sign in link', () => {
      cy.get('[data-test="signin-prompt"] > .govuk-link').contains('Sign in');
    });
  });

  describe('When signed in and services are unavailable', () => {
    beforeEach(() => {
      cy.task('stubPrisonerSignIn');
      cy.get('[data-test="signin-prompt"] > .govuk-link').click();
    });

    describe('When the timetable service is unavailable', () => {
      it('displays the expected message when the timetable services are unavailable', () => {
        cy.get('[data-test="timetable-error"]').should(
          'contain',
          'We are not able to show your timetable at this time,',
        );
      });

      it("displays the 'try again' link when the timetable services are unavailable", () => {
        cy.get('[data-test="timetable-error"] > a').should(
          'contain',
          'try again',
        );
      });
    });

    describe('When the incentive level (IEP) service is unavailable', () => {
      it('displays the expected message when the timetable services are unavailable', () => {
        cy.get('[data-test="incentives-error"]').should(
          'contain',
          'We are not able to show your incentive level at this time.',
        );
      });

      it("displays the 'try again' and 'find out more' links when the incentive level services are unavailable", () => {
        cy.get('[data-test="incentives-error"] > a')
          .first()
          .should('contain', 'Try again');
        cy.get('[data-test="incentives-error"] > a')
          .last()
          .should('contain', 'find out more about incentive levels');
      });
    });

    describe('When the money service is unavailable', () => {
      it('displays the expected message when the money services are unavailable', () => {
        cy.get('[data-test="money-error"]').should(
          'contain',
          'We are not able to show your balances or transactions at this time.',
        );
      });

      it("displays the 'try again' and 'find out more' links when the money services are unavailable", () => {
        cy.get('[data-test="money-error"] > a')
          .first()
          .should('contain', 'Try again');
        cy.get('[data-test="money-error"] > a')
          .last()
          .should('contain', 'find out more about money and debt');
      });
    });

    describe('When the visits service is unavailable', () => {
      it('displays the expected message when the visits services are unavailable', () => {
        cy.get('[data-test="visits-error"]').should(
          'contain',
          'We are not able to show your visit information at this time.',
        );
      });

      it("displays the 'try again' and 'find out more' links when the visits services are unavailable", () => {
        cy.get('[data-test="visits-error"] > a')
          .first()
          .should('contain', 'Try again');
        cy.get('[data-test="visits-error"] > a')
          .last()
          .should('contain', 'find out more about visits');
      });
    });
  });

  describe('When signed in', () => {
    beforeEach(() => {
      cy.task('stubOffenderDetails');
      cy.task('stubPrisonerSignIn');
      cy.get('[data-test="signin-prompt"] > .govuk-link').click();
    });

    describe('Page structure', () => {
      it('change the URL to include the expected path', () => {
        cy.url().should('include', '/profile');
      });

      it('displays the expected page title', () => {
        cy.get('.hub-header > h1').contains('My profile');
      });

      it("should contain the 'Todays timetable' section", () => {
        cy.get('[data-test="timetable-container"]').should('exist');
      });

      it("should contain the 'Incentive level (IEP)' section", () => {
        cy.get('[data-test="incentive-container"]').should('exist');
      });

      it("should contain the 'Money' section", () => {
        cy.get('[data-test="money-container"]').should('exist');
      });

      it("should contain the 'Visits' section", () => {
        cy.get('[data-test="visits-container"]').should('exist');
      });

      it('should contain the feedback widget', () => {
        cy.get('#feedback-widget').should('exist');
      });
    });
  });
});
