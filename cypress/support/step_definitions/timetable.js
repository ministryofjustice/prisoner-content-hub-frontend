import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { activity, appointment } from '../../mockApis/data';

import { format, addDays } from 'date-fns';

Then('I am displayed todays timetable', () => {
  cy.get('.todays-events > .govuk-body').contains(/.+/);
  cy.log('Timetable data has been passed through');
});

const daysFromNow = n => format(addDays(new Date(), n), 'yyyy-MM-dd');

const tableToObject = table => {
  const [keys, ...rows] = table.rawTable;
  return rows.map(values =>
    keys.reduce((o, k, i) => {
      o[k] = values[i];
      return o;
    }, {}),
  );
};

When('I have the following up coming events', args => {
  const rows = tableToObject(args);

  const events = rows.map(row => {
    const date = row.when === 'today' ? daysFromNow(0) : daysFromNow(1);
    return row.type === 'activity'
      ? activity(date, row.start, row.end, row.name, row.location)
      : appointment(date, row.start, row.end, row.name, row.location);
  });

  cy.task('stubEvents', events);
});

And('I log into the hub', () => {
  cy.task('stubPrisonerSignIn');
  cy.get('[data-test="signin-prompt"] > .govuk-link').click();
});

Then('I am shown my time table', args => {
  const days = tableToObject(args);

  days.forEach(day => {
    ['8:30am to 12:00pm', '12:00pm to 5:00pm', '5:00pm to 7:30pm'].forEach(
      period => {
        const section = cy
          .get(`[data-test="${day.type}"]`)
          .find(`[data-test="${period}"]`);

        day[period]
          .split(',')
          .forEach(event => section.should('contain', event));
      },
    );
  });
});
