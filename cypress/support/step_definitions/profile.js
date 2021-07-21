import { Before, Then, When, And } from 'cypress-cucumber-preprocessor/steps';

import { horizontalTableToObject, verticalTableToObject } from './utils';

Before(() => {
  cy.task('reset');
});

When('I have the following visits', args => {
  const rows = horizontalTableToObject(args);
  const visits = {
    content: rows.map(
      ({ startTime, endTime, visitType, visitors: visitorList }) => {
        const visitors = visitorList.split(',').map(name => {
          const [firstName, lastName] = name.trim().split(' ');
          return { firstName, lastName };
        });
        return {
          visitors,
          visitDetails: {
            startTime,
            endTime,
            visitType,
          },
        };
      },
    ),
  };

  cy.task('stubVisits', visits);
});

And('I have the the following remaining visits', args => {
  cy.task('stubVisitsRemaining', horizontalTableToObject(args)[0]);
});

const testCard = ({ dataTest, title, content }) => {
  const contentArr = Array.isArray(content) ? content : [content];
  cy.get(`[data-test="${dataTest}"]`).should(card => {
    expect(card.find('h3')).to.contain.text(title);
    contentArr.forEach(contentValue => {
      expect(card).to.contain.text(contentValue);
    });
  });
};
const testSensitiveCard = ({ dataTest, sensitive }) => {
  const sensitiveArr = Array.isArray(sensitive) ? sensitive : [sensitive];
  cy.get(`[data-test="${dataTest}"] .sensitive`).should(card => {
    sensitiveArr.forEach(sensitiveValue => {
      expect(card).to.contain.text(sensitiveValue);
    });
  });
};

Then('I am shown the following card', args => {
  const rows = verticalTableToObject(args);
  rows.forEach(testCard);
});

Then('I am shown the following closed sensitive card', args => {
  const rows = verticalTableToObject(args);
  rows.forEach(row => {
    testCard(row);
    testSensitiveCard(row);
  });
});

Then('the {string} sensitive card is open', dataTest => {
  cy.get(`[data-test="${dataTest}"]`).should(card => {
    expect(card.find('.closed')).to.be.hidden;
    expect(card.find('.open, .sensitive')).to.be.visible;
  });
});

Then('the {string} sensitive card is closed', dataTest => {
  cy.get(`[data-test="${dataTest}"]`).should(card => {
    expect(card.find('.closed')).to.be.visible;
    expect(card.find('.open, .sensitive')).to.be.hidden;
  });
});

When(`I click on the {string} card`, args => {
  cy.get(`[data-test="${args}"] a`).click();
});
