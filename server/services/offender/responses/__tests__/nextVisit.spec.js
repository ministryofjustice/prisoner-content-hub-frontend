const nextVisit = require('../nextVisit');

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
    const response = [
      {
        visitDetails: {
          startTime: '2019-12-07T11:30:30',
          endTime: '2019-12-07T13:00:30',
          visitTypeDescription: 'Social',
        },
        visitors: [],
      },
    ];

    const nextVisitData = nextVisit(response);

    expect(nextVisitData).toStrictEqual({
      hasNextVisit: true,
      nextVisit: 'Saturday 7 December',
      nextVisitDate: '7 December',
      nextVisitDay: 'Saturday',
      startTime: '11:30am',
      endTime: '1:00pm',
      visitType: 'Social',
      visitors: [],
    });
  });

  it('should format data when passed', () => {
    const response = [
      {
        visitDetails: {
          startTime: '2019-12-07T11:30:30',
          endTime: '2019-12-07T12:30:30',
          visitTypeDescription: 'TVT test visit type',
        },
        visitors: [{ firstName: 'Donald', lastName: 'Mouse' }],
      },
    ];

    const nextVisitData = nextVisit(response);

    expect(nextVisitData).toStrictEqual({
      hasNextVisit: true,
      nextVisit: 'Saturday 7 December',
      nextVisitDate: '7 December',
      nextVisitDay: 'Saturday',
      visitType: 'TVT',
      visitors: ['Donald Mouse'],
      startTime: '11:30am',
      endTime: '12:30pm',
    });
  });
});
