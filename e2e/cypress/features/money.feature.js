describe('Profile', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.task('stubPrimaryNavigation');
    cy.task('stubUrgentBanners');
    cy.task('stubBrowseAllTopics');
    cy.visit(`http://etwoe.content-hub.localhost:3000/profile`);
  });

  describe('When signed out', () => {
    it('displays the sign in link', () => {
      cy.get('[data-test="signin-prompt"] > .govuk-link').contains('Sign in');
    });
  });

  describe('When signed in', () => {
    beforeEach(() => {
      const balances = {
        spends: 123.45,
        cash: 5,
        savings: 9,
        currency: 'GBP',
      };

      cy.task('stubOffenderDetails');
      cy.task('stubBalancesFor', balances);
      cy.task('stubPrisonerSignIn');
      cy.get('[data-test="signin-prompt"] > .govuk-link').click();
    });

    describe('Money section', () => {
      it('displays the expected section heading', () => {
        cy.get('[data-test="money-container"] > div > h2').should(
          'contain',
          'Money',
        );
      });

      it("displays the 'Open all balances' link", () => {
        cy.get('[data-test="money-container"] > div > h2 > a > span')
          .first()
          .should('contain', 'Open')
          .should('be.visible');
      });

      it("hides the 'Close all balances' link by default", () => {
        cy.get('[data-test="money-container"] > div > h2 > a > span')
          .last()
          .should('contain', 'Close')
          .should('not.be.visible');
      });

      it("displays the 'Close all balances' link when 'Open all balances' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > h2 > a').should(
          'contain',
          'Open',
        );
        cy.get('[data-test="money-container"] > div > h2 > a').click();
        cy.get('[data-test="money-container"] > div > h2 > a > span')
          .last()
          .should('contain', 'Close')
          .should('be.visible');
      });

      it("hides the 'Open all balances' link when 'Open all balances' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > h2 > a').click();
        cy.get('[data-test="money-container"] > div > h2 > a > span')
          .first()
          .should('contain', 'Open')
          .should('not.be.visible');
      });

      it("displays all balances when 'Open all balances' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > h2 > a').click();

        cy.get('[data-test="money-spends"]')
          .should('contain', '£123.45')
          .should('be.visible');

        cy.get('[data-test="money-private"]')
          .should('contain', '£5.00')
          .should('be.visible');

        cy.get('[data-test="money-savings"]')
          .should('contain', '£9.00')
          .should('be.visible');
      });

      it("toggles the +/- link on the 'Spends', 'Private' and 'Savings' panels when the 'Open all balances' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > h2 > a').should(
          'contain',
          'Open',
        );

        cy.get('[data-test="money-container"] > div > h2 > a').click();

        cy.get('[data-test="moneySpends"] > h3 > span')
          .first()
          .should('contain', '-')
          .should('be.visible');

        cy.get('[data-test="moneyPrivate"] > h3 > span')
          .first()
          .should('contain', '-')
          .should('be.visible');

        cy.get('[data-test="moneySavings"] > h3 > span')
          .first()
          .should('contain', '-')
          .should('be.visible');

        cy.get('[data-test="moneySpends"] > h3 > span')
          .last()
          .should('contain', '+')
          .should('not.be.visible');

        cy.get('[data-test="moneyPrivate"] > h3 > span')
          .last()
          .should('contain', '+')
          .should('not.be.visible');

        cy.get('[data-test="moneySavings"] > h3 > span')
          .last()
          .should('contain', '+')
          .should('not.be.visible');
      });

      it("toggles the +/- link on the 'Spends', 'Private' and 'Savings' panels when the 'Close all balances' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > h2 > a').should(
          'contain',
          'Close',
        );

        cy.get('[data-test="money-container"] > div > h2 > a').dblclick();

        cy.get('[data-test="moneySpends"] > h3 > span')
          .first()
          .should('contain', '-')
          .should('not.be.visible');

        cy.get('[data-test="moneyPrivate"] > h3 > span')
          .first()
          .should('contain', '-')
          .should('not.be.visible');

        cy.get('[data-test="moneySavings"] > h3 > span')
          .first()
          .should('contain', '-')
          .should('not.be.visible');

        cy.get('[data-test="moneySpends"] > h3 > span')
          .last()
          .should('contain', '+')
          .should('be.visible');

        cy.get('[data-test="moneyPrivate"] > h3 > span')
          .last()
          .should('contain', '+')
          .should('be.visible');

        cy.get('[data-test="moneySavings"] > h3 > span')
          .last()
          .should('contain', '+')
          .should('be.visible');
      });

      it("hides all balances when 'Close all balances' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > h2 > a').dblclick();

        cy.get('[data-test="money-spends"]').should('not.be.visible');

        cy.get('[data-test="money-private"]').should('not.be.visible');

        cy.get('[data-test="money-savings"]').should('not.be.visible');
      });

      it("changes the URL when the 'Read more about money and debt' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > a').click();
        cy.url().should('include', '/tags/872');
      });

      describe('Spends panel', () => {
        it('displays the spends panel', () => {
          cy.get('[data-test="moneySpends"]')
            .should('exist')
            .should('be.visible');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="moneySpends"] > h3').should('exist');
          cy.get('[data-test="moneySpends"] > h3').should('contain', 'Spends');
        });

        it('hides the current balance by default', () => {
          cy.get('[data-test="money-spends"]').should('not.be.visible');
        });

        it("displays the open '+' link", () => {
          cy.get('[data-test="moneySpends"] > h3 > span')
            .last()
            .should('contain', '+')
            .should('be.visible');
        });

        it("hides the close '-' link by default", () => {
          cy.get('[data-test="moneySpends"] > h3 > span')
            .first()
            .should('contain', '-')
            .should('not.be.visible');
        });

        it("displays the close '-' link when the panel heading link is clicked", () => {
          cy.get('[data-test="moneySpends"] > h3 > a').click();
          cy.get('[data-test="moneySpends"] > h3 > span')
            .first()
            .should('contain', '-')
            .should('be.visible');
        });

        it("hides the open '+' link panel heading link is clicked once", () => {
          cy.get('[data-test="moneySpends"] > h3 > a').click();
          cy.get('[data-test="moneySpends"] > h3 > span')
            .last()
            .should('not.be.visible');
        });

        it('displays the current balance when the panel heading link is clicked once', () => {
          cy.get('[data-test="moneySpends"] > h3 > a').click();
          cy.get('[data-test="money-spends"]')
            .should('contain', '£123.45')
            .should('be.visible');
        });

        it('hides the current balance when panel heading link is clicked twice', () => {
          cy.get('[data-test="moneySpends"] > h3 > a').dblclick();
          cy.get('[data-test="money-spends"]').should('not.be.visible');
        });
      });

      describe('Private panel', () => {
        it('displays the private panel', () => {
          cy.get('[data-test="moneyPrivate"]')
            .should('exist')
            .should('be.visible');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="moneyPrivate"] > h3').should('exist');
          cy.get('[data-test="moneyPrivate"] > h3').should(
            'contain',
            'Private',
          );
        });

        it('hides the current balance by default', () => {
          cy.get('[data-test="money-private"]').should('not.be.visible');
        });

        it("displays the open '+' link", () => {
          cy.get('[data-test="moneyPrivate"] > h3 > span')
            .last()
            .should('contain', '+')
            .should('be.visible');
        });

        it("hides the close '-' link by default", () => {
          cy.get('[data-test="moneyPrivate"] > h3 > span')
            .first()
            .should('contain', '-')
            .should('not.be.visible');
        });

        it("displays the close '-' link when the panel heading link is clicked", () => {
          cy.get('[data-test="moneyPrivate"] > h3 > a').click();
          cy.get('[data-test="moneyPrivate"] > h3 > span')
            .first()
            .should('contain', '-')
            .should('be.visible');
        });

        it("hides the open '+' link panel heading link is clicked once", () => {
          cy.get('[data-test="moneyPrivate"] > h3 > a').click();
          cy.get('[data-test="moneyPrivate"] > h3 > span')
            .last()
            .should('not.be.visible');
        });

        it('displays the current balance when the panel heading link is clicked once', () => {
          cy.get('[data-test="moneyPrivate"] > h3 > a').click();
          cy.get('[data-test="money-private"]')
            .should('contain', '£5.00')
            .should('be.visible');
        });

        it('hides the current balance when panel heading link is clicked twice', () => {
          cy.get('[data-test="moneyPrivate"] > h3 > a').dblclick();
          cy.get('[data-test="money-private"]').should('not.be.visible');
        });
      });

      describe('Savings panel', () => {
        it('displays the savings panel', () => {
          cy.get('[data-test="moneySavings"]')
            .should('exist')
            .should('be.visible');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="moneySavings"] > h3').should('exist');
          cy.get('[data-test="moneySavings"] > h3').should(
            'contain',
            'Savings',
          );
        });

        it('hides the current balance by default', () => {
          cy.get('[data-test="money-savings"]').should('not.be.visible');
        });

        it("displays the open '+' link", () => {
          cy.get('[data-test="moneySavings"] > h3 > span')
            .last()
            .should('contain', '+')
            .should('be.visible');
        });

        it("hides the close '-' link by default", () => {
          cy.get('[data-test="moneySavings"] > h3 > span')
            .first()
            .should('contain', '-')
            .should('not.be.visible');
        });

        it("displays the close '-' link when the panel heading link is clicked", () => {
          cy.get('[data-test="moneySavings"] > h3 > a').click();
          cy.get('[data-test="moneySavings"] > h3 > span')
            .first()
            .should('contain', '-')
            .should('be.visible');
        });

        it("hides the open '+' link panel heading link is clicked once", () => {
          cy.get('[data-test="moneySavings"] > h3 > a').click();
          cy.get('[data-test="moneySavings"] > h3 > span')
            .last()
            .should('not.be.visible');
        });

        it('displays the current balance when the panel heading link is clicked once', () => {
          cy.get('[data-test="moneySavings"] > h3 > a').click();
          cy.get('[data-test="money-savings"]')
            .should('contain', '£9.00')
            .should('be.visible');
        });

        it('hides the current balance when panel heading link is clicked twice', () => {
          cy.get('[data-test="moneySavings"] > h3 > a').dblclick();
          cy.get('[data-test="money-savings"]').should('not.be.visible');
        });
      });

      describe('Transactions link panel', () => {
        it('displays the transactions link panel', () => {
          cy.get('[data-test="moneyLink"]').should('exist');
        });

        it('displays a transactions image', () => {
          cy.get('[data-test="moneyLink"] > img').should('exist');
        });

        it('displays a link to view your transactions', () => {
          cy.get('[data-test="moneyLink"] > h3 > a').should('exist');
          cy.get('[data-test="moneyLink"] > h3 > a').should(
            'contain',
            'View my transactions',
          );
        });

        it("changes to the transactions page when the 'View your transactions' link is clicked", () => {
          cy.get('[data-test="moneyLink"] > h3 > a').click();
          cy.url().should('include', '/money/transactions');
        });
      });
    });
  });
});
