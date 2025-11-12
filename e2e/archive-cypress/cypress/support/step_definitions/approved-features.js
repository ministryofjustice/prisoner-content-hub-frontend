import { Before, Then, When, And } from 'cypress-cucumber-preprocessor/steps';

import { horizontalTableToObject, verticalTableToObject } from './utils';

Before(() => {
  cy.task('reset');
});

When('I have no approved visitors', () =>
  cy.task('stubVisitors', { nextOfKin: [], otherContacts: [] }),
);

Then('I am told I have no visitors', () => {
  cy.get(`[data-test="no-approved-visitors"]`).contains(
    'You do not have any approved visitors yet',
  );
});

const flatMapVisitors = ({
  firstName,
  lastName,
  createdDate: createDateTime,
  count,
  active,
  approved,
}) =>
  new Array(count).fill('').map(() => ({
    firstName,
    lastName,
    createDateTime,
    activeFlag: active === 'true',
    approvedVisitorFlag: approved === 'true',
  }));

When('I have the following approved visitors', args => {
  const rows = horizontalTableToObject(args);
  const nextOfKin = rows
    .filter(({ nextOfKin }) => nextOfKin === 'true')
    .flatMap(flatMapVisitors);
  const otherContacts = rows
    .filter(({ nextOfKin }) => nextOfKin !== 'true')
    .flatMap(flatMapVisitors);
  cy.task('stubVisitors', { nextOfKin, otherContacts });
});

Then('I see the following approved visitors', args => {
  const rows = horizontalTableToObject(args);
  const visitors = rows.flatMap(({ name, count }) =>
    new Array(count).fill(name),
  );
  console.log(visitors);
  cy.get(`[data-test="approved-visitors-list"] dd`).each((element, index) => {
    expect(element.text().trim()).to.equal(visitors[index]);
  });
});
