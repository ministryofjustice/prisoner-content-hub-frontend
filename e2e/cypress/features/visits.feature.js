describe('Profile', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.task('stubPrimaryNavigation');
    cy.task('stubUrgentBanners');
    cy.task('stubBrowseAllTopics');
    cy.visit(`http://etwoe.content-hub.localhost:3000/profile`);
  });

  describe('When signed in', () => {
    let visitors;

    let visitsRemaining;

    beforeEach(() => {
      visitors = [
        {
          firstName: 'Bob',
          lastName: 'Visitor',
        },
        {
          firstName: 'Pam',
          lastName: 'Visitor',
        },
      ];

      const visit = {
        startTime: '2023-12-12T09:00:00',
        endTime: '2023-12-12T09:59:00',
        visitType: 'SCON',
        visitors,
      };

      visitsRemaining = {
        remainingPvo: 20,
        remainingVo: 4,
      };

      cy.task('stubOffenderDetails');
      cy.task('stubVisitors', visitors);
      cy.task('stubVisit', visit);
      cy.task('stubVisitsRemaining', visitsRemaining);
      cy.task('stubPrisonerSignIn');
      cy.get('[data-test="signin-prompt"] > .govuk-link').click();
    });

    describe('Visits section', () => {
      it('displays the expected section heading', () => {
        cy.get('[data-test="visits-container"] > h2').should(
          'contain',
          'Visits',
        );
      });

      describe('Your next visit panel', () => {
        it("displays the 'Your next visit' panel", () => {
          cy.get('[data-test="nextVisit"]')
            .should('exist')
            .should('be.visible');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="nextVisit"] > h3').should('exist');
          cy.get('[data-test="nextVisit"] > h3').should(
            'contain',
            'My next visit',
          );
        });

        it('displays the expected description', () => {
          cy.get('[data-test="nextVisit"] > p > strong').should(
            'contain',
            'Tuesday 12 December',
          );
          cy.get('[data-test="nextVisit"] > p')
            .should('contain', '9.00am to 9.59am')
            .should('contain', 'Social visit');
        });
      });

      describe('Visitors panel', () => {
        it('displays the vistors panel', () => {
          cy.get('[data-test="visitors"]').should('exist').should('be.visible');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="visitors"] > h3 > a').should('exist');
          cy.get('[data-test="visitors"] > h3 > a').should(
            'contain',
            'Who is coming to my next visit?',
          );
        });

        it('hides the visitor list by default', () => {
          cy.get('[data-test="visitors"] > li').should('not.be.visible');
        });

        it("displays the open '+' link", () => {
          cy.get('[data-test="visitors"] > h3 > span')
            .last()
            .should('contain', '+')
            .should('be.visible');
        });

        it("hides the close '-' link by default", () => {
          cy.get('[data-test="visitors"] > h3 > span')
            .first()
            .should('contain', '-')
            .should('not.be.visible');
        });

        it("toggles the open/close '+/-' link when the panel heading link is clicked", () => {
          cy.get('[data-test="visitors"] > h3 > a').click();
          cy.get('[data-test="visitors"] > h3 > span')
            .first()
            .should('contain', '-')
            .should('be.visible');
          cy.get('[data-test="visitors"] > h3 > span')
            .last()
            .should('not.be.visible');
        });

        it('displays the visitor list when the panel heading link is clicked once', () => {
          cy.get('[data-test="visitors"] > h3 > a').click();
          cy.get('[data-test="visitors"] > li')
            .first()
            .should(
              'contain',
              `${visitors[0].firstName} ${visitors[0].lastName}`,
            )
            .should('be.visible');
          cy.get('[data-test="visitors"] > li')
            .last()
            .should(
              'contain',
              `${visitors[1].firstName} ${visitors[1].lastName}`,
            )
            .should('be.visible');
        });

        it('hides the visitor list when panel heading link is clicked twice', () => {
          cy.get('[data-test="visitors"] > h3 > a').dblclick();
          cy.get('[data-test="visitors"] > li').should('not.be.visible');
        });
      });

      describe('Total visits remaining panel', () => {
        it("displays the 'Total visits remaining' panel", () => {
          cy.get('[data-test="visitsRemaining"]')
            .should('exist')
            .should('be.visible');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="visitsRemaining"] > h3').should('exist');
          cy.get('[data-test="visitsRemaining"] > h3').should(
            'contain',
            "Visits I've got left",
          );
        });

        it('displays the expected number of remaining visits', () => {
          cy.get('[data-test="visitsRemaining"] > p > strong').should(
            'contain',
            visitsRemaining.remainingPvo + visitsRemaining.remainingVo,
          );
        });
      });

      describe('Read more about visits link', () => {
        it('displays a link to read more about visits', () => {
          cy.get('[data-test="visitsLink"]').should('exist');
          cy.get('[data-test="visitsLink"]').should(
            'contain',
            'Read more about visits',
          );
        });

        it("changes to the visits information page when the 'Read more about visits' link is clicked", () => {
          cy.get('[data-test="visitsLink"]').click();
          cy.url().should('include', '/tags/1133');
        });
      });
    });
  });
});
