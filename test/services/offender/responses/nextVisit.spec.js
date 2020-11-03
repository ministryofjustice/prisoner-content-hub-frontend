const {
  NextVisit,
} = require('../../../../server/services/offender/responses/nextVisit');
const {
  placeholders: { DEFAULT },
} = require('../../../../server/utils/enums');

describe('NextVisit', () => {
  it('Should handle an empty response', () => {
    const nextVisit = NextVisit.from();

    expect(nextVisit.startTime).to.not.exist;
    expect(nextVisit.status).to.not.exist;
    expect(nextVisit.visitorName).to.not.exist;
    expect(nextVisit.visitType).to.not.exist;

    const formatted = nextVisit.format();

    expect(formatted).to.eql(
      {
        hasStartTime: false,
        nextVisit: DEFAULT,
        nextVisitDate: DEFAULT,
        nextVisitDay: DEFAULT,
        visitType: DEFAULT,
        visitorName: DEFAULT,
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
        hasStartTime: true,
        nextVisit: 'Saturday 07 December 2019',
        nextVisitDate: '7 December',
        nextVisitDay: 'Saturday',
        visitType: DEFAULT,
        visitorName: DEFAULT,
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
      hasStartTime: true,
      nextVisit: 'Saturday 07 December 2019',
      nextVisitDate: '7 December',
      nextVisitDay: 'Saturday',
      visitType: 'TVT',
      visitorName: 'Micky Mouse',
    });
  });
});
