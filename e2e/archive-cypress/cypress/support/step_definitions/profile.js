import { Before, Then, When, And } from 'cypress-cucumber-preprocessor/steps';

import { horizontalTableToObject, verticalTableToObject } from './utils';

Before(() => {
  cy.task('reset');
});

When('I have the following incentives', args => {
  const { level: iepLevel, date: iepDate } = horizontalTableToObject(args)[0];
  cy.task('stubIncentives', { iepLevel, iepDate });
});

When('I have the following money summary', args => {
  const balances = verticalTableToObject(args);
  cy.task('stubBalancesFor', balances[0]);
});

When('I have the following visit', args => {
  const rows = horizontalTableToObject(args);
  const { startTime, endTime, visitType, visitors: visitorList } = rows[0];

  const visitors = visitorList.split(',').map(name => {
    const [firstName, lastName] = name.trim().split(' ');
    return { firstName, lastName };
  });

  const visit = {
    visitors,
    startTime,
    endTime,
    visitType,
  };

  cy.task('stubVisit', visit);
});

And('I have the the following remaining visits', args => {
  cy.task('stubVisitsRemaining', horizontalTableToObject(args)[0]);
});

const makeArray = content => (Array.isArray(content) ? content : [content]);

const testCard = ({ card, title, content }) => {
  const contentArr = content && makeArray(content);
  cy.get(`[data-test="${card}"]`).should(cardElement => {
    expect(cardElement.find('h3')).to.contain.text(title);
    if (contentArr)
      contentArr.forEach(contentValue => {
        expect(cardElement).to.contain.text(contentValue);
      });
  });
};
const testSensitiveCard = ({ card, closedContent }) => {
  const closedContentArr = Array.isArray(closedContent)
    ? closedContent
    : [closedContent];
  cy.get(`[data-test="${card}"] .sensitive`).should(cardElement => {
    closedContentArr.forEach(closedContentValue => {
      expect(cardElement).to.contain.text(closedContentValue);
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
