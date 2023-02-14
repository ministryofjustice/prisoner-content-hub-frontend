const { Adjudications } = require('../adjudications');
const {
  placeholders: { DEFAULT },
} = require('../../../../utils/enums');

describe('Adjudications', () => {
  it('Should handle an empty response', () => {
    const adjudications = Adjudications.from();

    expect(adjudications.adjudications).not.toBeDefined();

    const formatted = adjudications.format();

    expect(formatted).toStrictEqual({});
  });

  it('should handle an incomplete response', () => {
    const response = {
      results: [
        {
          adjudicationNumber: 12345,
        },
        {
          reportTime: '2016-05-08T14:16:00',
        },
        {},
      ],
    };

    const formatted = Adjudications.from(response).format();

    expect(formatted).toStrictEqual([
      {
        adjudicationNumber: 12345,
        reportTime: DEFAULT,
        numberOfCharges: 0,
      },
      {
        adjudicationNumber: DEFAULT,
        reportTime: '8 May 2016, 2.16pm',
        numberOfCharges: 0,
      },
      {
        adjudicationNumber: DEFAULT,
        reportTime: DEFAULT,
        numberOfCharges: 0,
      },
    ]);
  });

  it('should format data when passed', () => {
    const response = {
      results: [
        {
          adjudicationNumber: 1310574,
          reportTime: '2016-05-08T14:16:00',
          agencyIncidentId: 1291673,
          agencyId: 'WMI',
          partySeq: 1,
          adjudicationCharges: [{}],
        },
        {
          adjudicationNumber: 1310549,
          reportTime: '2012-01-10T08:52:00',
          agencyIncidentId: 1291652,
          agencyId: 'WMI',
          partySeq: 1,
          adjudicationCharges: [{}, {}, {}, {}, {}],
        },
      ],
    };

    const formatted = Adjudications.from(response).format();

    expect(formatted).toStrictEqual([
      {
        adjudicationNumber: 1310574,
        reportTime: '8 May 2016, 2.16pm',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 1310549,
        reportTime: '10 January 2012, 8.52am',
        numberOfCharges: 5,
      },
    ]);
  });
});
