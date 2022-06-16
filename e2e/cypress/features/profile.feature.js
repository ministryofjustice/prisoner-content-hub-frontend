import { activity } from '../mockApis/data';
import { daysFromNow } from '../support/step_definitions/utils';

describe('Profile', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.task('stubPrimaryNavigation');
    cy.task('stubUrgentBanners');
    cy.task('stubBrowseAllTopics');
    cy.visit(`http://cookhamwood.content-hub.localhost:3000/profile`);
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
    const activities = ['activity 1', 'activity 2', 'activity 3'];

    const locations = ['Locations 1', 'Locations 2', 'Locations 3'];

    let visitors;

    let visitsRemaining;

    beforeEach(() => {
      const TODAY = daysFromNow(0);

      const todaysEvents = [
        activity(TODAY, '08:10', '11:25', activities[0], locations[0]),
        activity(TODAY, '11:25', '12:00', activities[1], locations[1]),
        activity(TODAY, '13:35', '16:45', activities[2], locations[2]),
      ];

      const incentives = {
        iepLevel: 'Basic',
        iepDate: '2017-03-08',
      };

      const balances = {
        spends: 123.45,
        cash: 5,
        savings: 9,
        currency: 'GBP',
      };

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

      cy.task('stubEvents', todaysEvents);
      cy.task('stubOffenderDetails');
      cy.task('stubIncentives', incentives);
      cy.task('stubBalancesFor', balances);
      cy.task('stubVisitors', visitors);
      cy.task('stubVisit', visit);
      cy.task('stubVisitsRemaining', visitsRemaining);
      cy.task('stubPrisonerSignIn');
      cy.get('[data-test="signin-prompt"] > .govuk-link').click();
    });

    describe('Page structure', () => {
      it('change the URL to include the expected path', () => {
        cy.url().should('include', '/profile');
      });

      it('displays the expected page title', () => {
        cy.get('.hub-header > h1').contains('Your profile');
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

    describe('Todays timetable section', () => {
      it('displays the expected section heading', () => {
        cy.get('[data-test="timetable-container"] > h2').should(
          'contain',
          "Today's timetable",
        );
      });

      describe('Morning events panel', () => {
        it('displays the morning events panel', () => {
          cy.get('[data-test="morningEvents"]').should('exist');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="morningEvents"] > h3').should('exist');
          cy.get('[data-test="morningEvents"] > h3').should(
            'contain',
            'Morning',
          );
        });

        it('displays activity details', () => {
          cy.get('[data-test="morningEvents"] > div')
            .first()
            .should('contain', activities[0]);
          cy.get('[data-test="morningEvents"] > div')
            .first()
            .should('contain', '8:10am to 11:25am');
          cy.get('[data-test="morningEvents"] > div')
            .first()
            .should('contain', locations[0]);

          cy.get('[data-test="morningEvents"] > div')
            .last()
            .should('contain', activities[1]);
          cy.get('[data-test="morningEvents"] > div')
            .last()
            .should('contain', '11:25am to 12:00pm');
          cy.get('[data-test="morningEvents"] > div')
            .last()
            .should('contain', locations[1]);
        });
      });

      describe('Afternoon events panel', () => {
        it('displays the afternoon events panel', () => {
          cy.get('[data-test="afternoonEvents"]').should('exist');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="afternoonEvents"] > h3').should('exist');
          cy.get('[data-test="afternoonEvents"] > h3').should(
            'contain',
            'Afternoon',
          );
        });

        it('displays activity details', () => {
          cy.get('[data-test="afternoonEvents"] > div')
            .first()
            .should('contain', activities[2]);
          cy.get('[data-test="afternoonEvents"] > div')
            .first()
            .should('contain', '1:35pm to 4:45pm');
          cy.get('[data-test="afternoonEvents"] > div')
            .first()
            .should('contain', locations[2]);
        });
      });

      describe('Evening events panel', () => {
        it('displays the evening events panel', () => {
          cy.get('[data-test="eveningEvents"]').should('exist');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="eveningEvents"] > h3').should('exist');
          cy.get('[data-test="eveningEvents"] > h3').should(
            'contain',
            'Evening',
          );
        });

        it('displays the expected message when no activities are scheduled during the period', () => {
          cy.get('[data-test="eveningEvents"] > p').should(
            'contain',
            'No activities scheduled',
          );
        });
      });

      describe('Timetable link panel', () => {
        it('displays the timetable link panel', () => {
          cy.get('[data-test="timetableLink"]').should('exist');
        });

        it('displays a timetable image', () => {
          cy.get('[data-test="timetableLink"] > img').should('exist');
        });

        it('displays a link to view your full timetable', () => {
          cy.get('[data-test="timetableLink"] > h3 > a').should('exist');
          cy.get('[data-test="timetableLink"] > h3 > a').should(
            'contain',
            'View your full timetable',
          );
        });

        it("changes to the timetable page when the 'View your full timetable' link is clicked", () => {
          cy.get('[data-test="timetableLink"] > h3 > a').click();
          cy.url().should('include', '/timetable');
        });
      });
    });

    describe('Incentive level (IEP) section', () => {
      it('displays the expected section heading', () => {
        cy.get('[data-test="incentive-container"] > h2').should(
          'contain',
          'Incentive level (IEP)',
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
            'Your current incentive level is',
          );
        });

        it('displays the expected description', () => {
          cy.get('[data-test="currentLevel"] > p').should('contain', 'Basic');
        });
      });

      describe('Incentive review date panel', () => {
        it('displays the current incentive level panel', () => {
          cy.get('[data-test="reviewDate"]').should('exist');
        });

        it('displays the expected panel heading', () => {
          cy.get('[data-test="reviewDate"] > h3').should('exist');
          cy.get('[data-test="reviewDate"] > h3').should(
            'contain',
            'This can be reviewed from',
          );
        });

        it('displays the expected description', () => {
          cy.get('[data-test="reviewDate"] > p').should(
            'contain',
            'Thursday 8 June 2017',
          );
        });
      });

      describe('Incentives link panel', () => {
        it('displays the incentives link panel', () => {
          cy.get('[data-test="incentivesLink"]').should('exist');
        });

        it('displays an incentives image', () => {
          cy.get('[data-test="incentivesLink"] > img').should('exist');
        });

        it('displays a link to read more about incentive levels', () => {
          cy.get('[data-test="incentivesLink"] > h3 > a').should('exist');
          cy.get('[data-test="incentivesLink"] > h3 > a').should(
            'contain',
            'Read more about incentive levels',
          );
        });

        it("changes to the incentives page when the 'Read more about incentive levels' link is clicked", () => {
          cy.get('[data-test="incentivesLink"] > h3 > a').click();
          cy.url().should('include', '/tags/1417');
        });
      });
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
          .should('contain', 'Open all balances')
          .should('be.visible');
      });

      it("hides the 'Close all balances' link by default", () => {
        cy.get('[data-test="money-container"] > div > h2 > a > span')
          .last()
          .should('contain', 'Close all balances')
          .should('not.be.visible');
      });

      it("displays the 'Close all balances' link when 'Open all balances' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > h2 > a').should(
          'contain',
          'Open all balances',
        );
        cy.get('[data-test="money-container"] > div > h2 > a').click();
        cy.get('[data-test="money-container"] > div > h2 > a > span')
          .last()
          .should('contain', 'Close all balances')
          .should('be.visible');
      });

      it("hides the 'Open all balances' link when 'Open all balances' link is clicked", () => {
        cy.get('[data-test="money-container"] > div > h2 > a').click();
        cy.get('[data-test="money-container"] > div > h2 > a > span')
          .first()
          .should('contain', 'Open all balances')
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
          'Open all balances',
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
          'Close all balances',
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

        it('displays the expected description', () => {
          cy.get('[data-test="moneySpends"] > p').should(
            'contain',
            'Spends account current balance',
          );
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

        it('displays the expected description', () => {
          cy.get('[data-test="moneyPrivate"] > p').should(
            'contain',
            'Private account current balance',
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

        it('displays the expected description', () => {
          cy.get('[data-test="moneySavings"] > p').should(
            'contain',
            'Savings account current balance',
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
            'View your transactions',
          );
        });

        it("changes to the transactions page when the 'View your transactions' link is clicked", () => {
          cy.get('[data-test="moneyLink"] > h3 > a').click();
          cy.url().should('include', '/money/transactions');
        });
      });
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
            'Your next visit',
          );
        });

        it('displays the expected description', () => {
          cy.get('[data-test="nextVisit"] > p > strong').should(
            'contain',
            'Tuesday 12 December',
          );
          cy.get('[data-test="nextVisit"] > p')
            .should('contain', '9:00am to 9:59am')
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
            'Visitors coming to your next visit',
          );
        });

        it('displays the expected description', () => {
          cy.get('[data-test="visitors"] > div').should(
            'contain',
            'See who’s coming to your next visit',
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
            'Total visits remaining',
          );
        });

        it('displays the expected number of remaining visits', () => {
          cy.get('[data-test="visitsRemaining"] > p > strong').should(
            'contain',
            visitsRemaining.remainingPvo + visitsRemaining.remainingVo,
          );
        });
      });

      describe('Read more about visits link panel', () => {
        it("displays the 'Read more about visits' link panel", () => {
          cy.get('[data-test="visitsLink"]').should('exist');
        });

        it('displays a visits image', () => {
          cy.get('[data-test="visitsLink"] > img').should('exist');
        });

        it('displays a link to read more about visits', () => {
          cy.get('[data-test="visitsLink"] > h3 > a').should('exist');
          cy.get('[data-test="visitsLink"] > h3 > a').should(
            'contain',
            'Read more about visits',
          );
        });

        it("changes to the visits information page when the 'Read more about visits' link is clicked", () => {
          cy.get('[data-test="visitsLink"] > h3 > a').click();
          cy.url().should('include', '/tags/1133');
        });
      });
    });
  });
});
