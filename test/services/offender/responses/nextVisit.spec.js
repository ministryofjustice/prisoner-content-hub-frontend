const {
  NextVisit,
} = require('../../../../server/services/offender/responses/nextVisit');

const DEFAULT_VALUE = 'Unavailable';

describe('Offender', () => {
  it('Should handle an empty response', () => {
    const offender = NextVisit.from();

    expect(offender.startTime).to.not.exist;
    expect(offender.status).to.not.exist;
    expect(offender.visitorName).to.not.exist;
    expect(offender.visitType).to.not.exist;

    const formatted = offender.format();

    expect(formatted).to.eql(
      {
        error: 'No upcoming visit',
      },
      'Should return a notification when no start time or status is available',
    );
  });

  it('should handle an incomplete response', () => {
    const response = {
      startTime: '2019-12-07T11:30:30',
      eventStatus: 'SCH',
    };

    const formatted = NextVisit.from(response).format();

    expect(formatted).to.eql(
      {
        nextVisit: 'Saturday 07 December 2019',
        nextVisitDate: '7 December',
        nextVisitDay: 'Saturday',
        visitType: DEFAULT_VALUE,
        visitorName: DEFAULT_VALUE,
      },
      'Should handle missing visitor name or type',
    );
  });

  it('should format data when passed', () => {
    const response = {
      startTime: '2019-12-07T11:30:30',
      eventStatus: 'SCH',
      visitTypeDescription: 'TVT test visit type',
      leadVisitor: 'MICKY MOUSE',
    };

    const formatted = NextVisit.from(response).format();

    expect(formatted).to.eql({
      nextVisit: 'Saturday 07 December 2019',
      nextVisitDate: '7 December',
      nextVisitDay: 'Saturday',
      visitType: 'TVT',
      visitorName: 'Micky Mouse',
    });
  });
});
