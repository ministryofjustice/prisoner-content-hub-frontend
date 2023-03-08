const {
  formatName,
  formatSanction,
  formatOffence,
  formatHearing,
} = require('../adjudication');

describe('formatName', () => {
  it('Should reduce the first name value down to a single capitalised initial with a . added to the end', () => {
    expect(formatName('first')).toBe('F. ');
  });

  it('Should convert the last name value to lowercase and capitalise the first letter', () => {
    expect(formatName(null, 'LAST')).toBe(' Last');
  });

  it('Should return and empty string when first and last name values are missing', () => {
    expect(formatName(null, null)).toBe(' ');
  });

  it('Should concatinate the first and last name values and return them in the expected format when both are provided', () => {
    expect(formatName('first', 'LAST')).toBe('F. Last');
  });
});

describe('formatSanction', () => {
  let sanction;
  let formattedSanction;

  beforeEach(() => {
    sanction = {
      sanctionType: 'Cellular Confinement',
      sanctionDays: 7,
      effectiveDate: '2017-03-21T11:03:00',
      status: 'Immediate',
      statusDate: '2017-03-21T11:03:00',
      sanctionSeq: 50,
    };

    formattedSanction = {
      sanctionType: 'Cellular Confinement',
      sanctionDays: '7 days',
      startDate: '21 March 2017',
      status: 'Immediate',
      statusDate: '21 March 2017',
    };
  });

  afterEach(() => {
    sanction = {};
    formattedSanction = {};
  });

  it('Should gracefully handle a missing sanction object value', () => {
    expect(formatSanction()).toStrictEqual({});
  });

  it('Should gracefully handle sanction object with missing fields value', () => {
    const incompleteSanction = { ...sanction };

    delete incompleteSanction.sanctionType;
    delete incompleteSanction.statusDate;

    expect(formatSanction(incompleteSanction)).toStrictEqual({
      sanctionType: 'Unavailable',
      sanctionDays: '7 days',
      startDate: '21 March 2017',
      status: 'Immediate',
      statusDate: 'Unavailable',
    });
  });

  it('Should return formatted JSON object ', () => {
    expect(formatSanction(sanction)).toStrictEqual(formattedSanction);
  });
});

describe('formatOffence', () => {
  let offence;
  let formattedOffence;

  beforeEach(() => {
    offence = {
      oicOffenceCode: '51:22',
      offenceType: 'Prison Rule 51',
      offenceDescription: 'Disobeys any lawful order',
      plea: 'Guilty',
      finding: 'Charge Proved',
      sanctions: [],
    };

    formattedOffence = {
      offenceCode: '51:22',
      offenceType: 'Prison Rule 51',
      offenceDescription: 'Disobeys any lawful order',
      plea: 'Guilty',
      finding: 'Charge Proved',
      sanctions: [],
    };
  });

  afterEach(() => {
    offence = {};
    formattedOffence = {};
  });

  it('Should gracefully handle a missing offence object value', () => {
    expect(formatOffence()).toMatchObject({});
  });

  it('Should gracefully handle offence object with missing fields value', () => {
    const incompleteOffence = { ...offence };

    delete incompleteOffence.oicOffenceCode;
    delete incompleteOffence.plea;
    delete incompleteOffence.sanctions;

    expect(formatOffence(incompleteOffence)).toStrictEqual({
      offenceCode: 'Unavailable',
      offenceType: 'Prison Rule 51',
      offenceDescription: 'Disobeys any lawful order',
      plea: 'Unavailable',
      finding: 'Charge Proved',
      sanctions: 'Unavailable',
    });
  });

  it('Should return formatted JSON object ', () => {
    expect(formatOffence(offence)).toMatchObject(formattedOffence);
  });
});

describe('formatHearing', () => {
  let hearing;
  let formattedHearing;

  beforeEach(() => {
    hearing = {
      oicHearingId: 1987727,
      hearingType: "Governor's Hearing Adult",
      hearingTime: '2017-03-20T09:00:00',
      establishment: 'Buckley Hall (HMP)',
      location: 'Adjudication Room',
      heardByFirstName: 'ANMUALRICHARD',
      heardByLastName: 'DONOPHER',
      comment: 'UiSUiS',
      results: [],
    };

    formattedHearing = {
      hearingTime: '20 March 2017, 9.00am',
      hearingType: "Governor's Hearing Adult",
      location: 'Adjudication Room, Buckley Hall (HMP)',
      heardBy: 'A. Donopher',
      comment: 'UiSUiS',
      offences: [],
    };
  });

  afterEach(() => {
    hearing = {};
    formattedHearing = {};
  });

  it('Should gracefully handle a missing hearing object value', () => {
    expect(formatHearing()).toMatchObject({});
  });

  it('Should gracefully handle hearing object with missing fields value', () => {
    const incompleteHearing = { ...hearing };

    delete incompleteHearing.hearingTime;
    delete incompleteHearing.heardByFirstName;
    delete incompleteHearing.heardByLastName;
    delete incompleteHearing.comment;

    expect(formatHearing(incompleteHearing)).toStrictEqual({
      hearingTime: 'Unavailable',
      hearingType: "Governor's Hearing Adult",
      location: 'Adjudication Room, Buckley Hall (HMP)',
      heardBy: 'Unavailable',
      comment: 'Unavailable',
      offences: [],
    });
  });

  it('Should return formatted JSON object ', () => {
    expect(formatHearing(hearing)).toMatchObject(formattedHearing);
  });
});
