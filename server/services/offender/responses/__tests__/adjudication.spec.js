const { Adjudication } = require('../adjudication');

describe('Adjudication', () => {
  let rawAdjudication;
  let formattedAdjudication;

  beforeEach(() => {
    rawAdjudication = {
      adjudicationNumber: 9999999,
      incidentTime: '2017-03-19T10:10:00',
      establishment: 'Buckley Hall (HMP)',
      interiorLocation: 'CSU',
      incidentDetails: 'Test incident details.',
      reportNumber: 7777777,
      reportType: "Governor's Report",
      reporterFirstName: 'OLBDALIAN',
      reporterLastName: 'JOYCESA',
      reportTime: '2017-03-19T10:10:00',
      hearings: [
        {
          oicHearingId: 1111111,
          hearingType: "Governor's Hearing Adult",
          hearingTime: '2017-03-20T09:00:00',
          establishment: 'Buckley Hall (HMP)',
          location: 'Adjudication Room',
          heardByFirstName: 'TEST',
          heardByLastName: 'NAME',
          comment: 'A test comment',
          results: [
            {
              oicOffenceCode: '51:22',
              offenceType: 'Prison Rule 51',
              offenceDescription: 'Disobeys any lawful order',
              plea: 'Guilty',
              finding: 'Charge Proved',
              sanctions: [
                {
                  sanctionType: 'Cellular Confinement',
                  sanctionDays: 7,
                  effectiveDate: '2017-03-21T00:00:00',
                  status: 'Immediate',
                  statusDate: '2017-03-21T00:00:00',
                  sanctionSeq: 50,
                },
              ],
            },
          ],
        },
        {
          oicHearingId: 2222222,
          hearingType: "Governor's Hearing Adult",
          hearingTime: '2017-03-21T08:00:00',
          establishment: 'Buckley Hall (HMP)',
          location: 'Adjudication Room',
          heardByFirstName: 'ANOTHER',
          heardByLastName: 'TESTNAME',
          comment: 'A comment',
          results: [
            {
              oicOffenceCode: '51:22',
              offenceType: 'Prison Rule 51',
              offenceDescription: 'Disobeys any lawful order',
              plea: 'Guilty',
              finding: 'Charge Proved',
              sanctions: [
                {
                  sanctionType: 'Cellular Confinement',
                  sanctionDays: 7,
                  effectiveDate: '2017-03-21T00:00:00',
                  status: 'Immediate',
                  statusDate: '2017-03-21T00:00:00',
                  sanctionSeq: 50,
                },
              ],
            },
          ],
        },
      ],
    };

    formattedAdjudication = {
      adjudicationNumber: 9999999,
      reportNumber: 7777777,
      incidentDateTime: '19 March 2017, 10.10am',
      location: 'CSU, Buckley Hall (HMP)',
      reportedBy: 'O. Joycesa',
      reportDateTime: '19 March 2017, 10.10am',
      incidentDetails: 'Test incident details.',
      hearings: [
        {
          hearingTime: '21 March 2017, 8.00am',
          hearingType: "Governor's Hearing Adult",
          location: 'Adjudication Room, Buckley Hall (HMP)',
          heardBy: 'A. Testname',
          comment: 'A comment',
          offences: [
            {
              offenceCode: '51:22',
              offenceType: 'Prison Rule 51',
              offenceDescription: 'Disobeys any lawful order',
              plea: 'Guilty',
              finding: 'Charge Proved',
              sanctions: [
                {
                  sanctionType: 'Cellular Confinement',
                  sanctionDays: '7 days',
                  startDate: '21 March 2017',
                  status: 'Immediate',
                  statusDate: '21 March 2017',
                },
              ],
            },
          ],
        },
        {
          hearingTime: '20 March 2017, 9.00am',
          hearingType: "Governor's Hearing Adult",
          location: 'Adjudication Room, Buckley Hall (HMP)',
          heardBy: 'T. Name',
          comment: 'A test comment',
          offences: [
            {
              offenceCode: '51:22',
              offenceType: 'Prison Rule 51',
              offenceDescription: 'Disobeys any lawful order',
              plea: 'Guilty',
              finding: 'Charge Proved',
              sanctions: [
                {
                  sanctionType: 'Cellular Confinement',
                  sanctionDays: '7 days',
                  startDate: '21 March 2017',
                  status: 'Immediate',
                  statusDate: '21 March 2017',
                },
              ],
            },
          ],
        },
      ],
    };
  });

  afterEach(() => {
    rawAdjudication = null;
    formattedAdjudication = null;
  });

  it('Should return a formatted adjudication object containing hearings in descending order', () => {
    const formatted = Adjudication.from(rawAdjudication).format();

    expect(formatted).toStrictEqual(formattedAdjudication);
  });
});
