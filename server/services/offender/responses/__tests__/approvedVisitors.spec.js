const approvedVisitors = require('../approvedVisitors');

describe('approvedVisitors', () => {
  let approvedVisitorsList;
  beforeEach(() => {
    const visitorFirst = {
      firstName: 'AAA',
      lastName: 'AAA',
      createDateTime: '2007-07-29T04:17:40.59704',
      activeFlag: true,
      approvedVisitorFlag: true,
    };
    const visitorMiddle = {
      ...visitorFirst,
      firstName: 'BBB',
      createDateTime: '2007-07-29T04:17:39.59704',
    };
    const visitorLast = {
      ...visitorFirst,
      firstName: 'CCC',
      createDateTime: '2007-06-23T04:17:39.59704',
    };
    const visitorActiveFalse = {
      ...visitorFirst,
      firstName: 'DDD',
      activeFlag: false,
    };
    const visitorApprovedFalse = {
      ...visitorFirst,
      firstName: 'EEE',
      approvedVisitorFlag: false,
    };
    const nextOfKin = [
      visitorLast,
      visitorMiddle,
      visitorActiveFalse,
      visitorApprovedFalse,
    ];
    const otherContacts = [
      visitorMiddle,
      visitorActiveFalse,
      visitorApprovedFalse,
      visitorFirst,
    ];
    const visitors = { nextOfKin, otherContacts };
    approvedVisitorsList = approvedVisitors(visitors);
  });
  it('should return an Array of names of approved, active visitors', () => {
    expect(approvedVisitorsList).toBeInstanceOf(Array);
    expect(approvedVisitorsList.length).toBe(4);
    expect(approvedVisitorsList).toEqual(
      expect.arrayContaining(['Aaa Aaa', 'Bbb Aaa', 'Ccc Aaa']),
    );
  });
  it('should sort the visitors by "createdDateTime"', () => {
    expect(approvedVisitorsList[0]).toEqual('Aaa Aaa');
    expect(approvedVisitorsList[1]).toEqual('Bbb Aaa');
    expect(approvedVisitorsList[3]).toEqual('Ccc Aaa');
  });
});
