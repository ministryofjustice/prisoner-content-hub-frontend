const nextVisit = require('../nextVisit');
const visitTypeDisplayText = require('../../../../content/visitType.json');

const VISIT_TYPE = 'SCON';

describe('NextVisit', () => {
  it('Should handle an empty response', () => {
    const nextVisitData = nextVisit();

    expect(nextVisitData.startTime).not.toBeDefined();
    expect(nextVisitData.status).not.toBeDefined();
    expect(nextVisitData.visitorName).not.toBeDefined();
    expect(nextVisitData.visitType).not.toBeDefined();
    expect(nextVisitData.hasNextVisit).toStrictEqual(false);
  });

  it('should handle visit details', () => {
    const response = {
      startTime: '2019-12-07T11:30:30',
      endTime: '2019-12-07T13:00:30',
      visitType: VISIT_TYPE,
      visitors: [],
    };

    const nextVisitData = nextVisit(response);

    expect(nextVisitData).toStrictEqual({
      hasNextVisit: true,
      nextVisit: 'Saturday 7 December',
      nextVisitDate: '7 December',
      nextVisitDay: 'Saturday',
      startTime: '11:30am',
      endTime: '1:00pm',
      visitType: visitTypeDisplayText[VISIT_TYPE],
      visitors: [],
    });
  });

  it('should format data when passed', () => {
    const response = {
      startTime: '2019-12-07T11:30:30',
      endTime: '2019-12-07T12:30:30',
      visitType: VISIT_TYPE,
      visitors: [{ firstName: 'Donald', lastName: 'Mouse' }],
    };

    const nextVisitData = nextVisit(response);

    expect(nextVisitData).toStrictEqual({
      hasNextVisit: true,
      nextVisit: 'Saturday 7 December',
      nextVisitDate: '7 December',
      nextVisitDay: 'Saturday',
      visitType: visitTypeDisplayText[VISIT_TYPE],
      visitors: ['Donald Mouse'],
      startTime: '11:30am',
      endTime: '12:30pm',
    });
  });
});
