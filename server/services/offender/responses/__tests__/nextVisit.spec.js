const { NextVisit } = require('../nextVisit');
const {
  placeholders: { DEFAULT },
} = require('../../../../utils/enums');
const visitTypeDisplayText = require('../../../../content/visitType.json');

const VISIT_TYPE = 'SCON';

describe('NextVisit', () => {
  it('Should handle an empty response', () => {
    const nextVisit = NextVisit.from();

    expect(nextVisit.startTime).not.toBeDefined();
    expect(nextVisit.status).not.toBeDefined();
    expect(nextVisit.visitorName).not.toBeDefined();
    expect(nextVisit.visitType).not.toBeDefined();

    const formatted = nextVisit.format();

    expect(formatted).toStrictEqual(
      {
        hasNextVisit: false,
        nextVisit: DEFAULT,
        nextVisitDate: DEFAULT,
        nextVisitDay: DEFAULT,
        visitType: null,
        visitorName: DEFAULT,
        startTime: DEFAULT,
        endTime: DEFAULT,
      },
      'Should return a notification when no start time or status is available',
    );
  });

  it('should handle an incomplete response', () => {
    const response = {
      startTime: '2019-12-07T11:30:30',
      endTime: '2019-12-07T13:00:30',
      eventStatus: 'SCH',
    };

    const formatted = NextVisit.from(response).format();

    expect(formatted).toStrictEqual(
      {
        hasNextVisit: true,
        nextVisit: 'Saturday 7 December',
        nextVisitDate: '7 December',
        nextVisitDay: 'Saturday',
        visitType: null,
        visitorName: DEFAULT,
        startTime: '11:30am',
        endTime: '1:00pm',
      },
      'Should handle missing visitor name or type',
    );
  });

  it('should format data when passed', () => {
    const response = {
      startTime: '2019-12-07T11:30:30',
      endTime: '2019-12-07T12:30:30',
      eventStatus: 'SCH',
      visitType: VISIT_TYPE,
      leadVisitor: 'MICKY MOUSE',
    };

    const formatted = NextVisit.from(response).format();

    expect(formatted).toStrictEqual({
      hasNextVisit: true,
      nextVisit: 'Saturday 7 December',
      nextVisitDate: '7 December',
      nextVisitDay: 'Saturday',
      visitType: visitTypeDisplayText[VISIT_TYPE],
      visitorName: 'Micky Mouse',
      startTime: '11:30am',
      endTime: '12:30pm',
    });
  });
});
