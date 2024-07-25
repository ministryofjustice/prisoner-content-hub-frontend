const {
  capitalize,
  capitalizeAll,
  capitalizePersonName,
  groupBy,
  sortBy,
  checkFeatureEnabledAtSite,
} = require('../index');

describe('Utils', () => {
  describe('capitalize', () => {
    [
      {
        input: 'testword',
        output: 'Testword',
      },
      {
        input: '',
        output: '',
      },
      {
        input: 'TESTWORD',
        output: 'Testword',
      },
      {
        input: 'Testword',
        output: 'Testword',
      },
      {
        input: 'teSTword',
        output: 'Testword',
      },
      {
        input: 'teSTword testy',
        output: 'Testword testy',
      },
    ].forEach(test => {
      it(`should capitalize "${test.input}" to "${test.output}"`, () => {
        expect(capitalize(test.input)).toBe(test.output);
      });
    });
  });
  describe('capitalizeAll', () => {
    [
      {
        input: 'testword',
        output: 'Testword',
      },
      {
        input: '',
        output: '',
      },
      {
        input: 'TESTWORD',
        output: 'Testword',
      },
      {
        input: 'Testword',
        output: 'Testword',
      },
      {
        input: 'teSTword',
        output: 'Testword',
      },
      {
        input: 'teSTword testy',
        output: 'Testword Testy',
      },
      {
        input: 'teSTword tEsty',
        output: 'Testword Testy',
      },
      {
        input: 'teSTword-testy',
        output: 'Testword-testy',
      },
    ].forEach(test => {
      it(`should capitalize "${test.input}" to "${test.output}"`, () => {
        expect(capitalizeAll(test.input)).toBe(test.output);
      });
    });
  });
  describe('capitalizePersonName', () => {
    [
      {
        input: 'testword',
        output: 'Testword',
      },
      {
        input: '',
        output: '',
      },
      {
        input: 'TESTWORD',
        output: 'Testword',
      },
      {
        input: 'Testword',
        output: 'Testword',
      },
      {
        input: 'teSTword',
        output: 'Testword',
      },
      {
        input: 'teSTword testy',
        output: 'Testword Testy',
      },
      {
        input: 'teSTword tEsty',
        output: 'Testword Testy',
      },
      {
        input: 'teSTword-testy',
        output: 'Testword-Testy',
      },
      {
        input: 'teSTword tEsty-berp',
        output: 'Testword Testy-Berp',
      },
      {
        input: 'teSTword testyMc-Testtes',
        output: 'Testword Testymc-Testtes',
      },
    ].forEach(test => {
      it(`should capitalize "${test.input}" to "${test.output}"`, () => {
        expect(capitalizePersonName(test.input)).toBe(test.output);
      });
    });
  });

  describe('groupBy', () => {
    it('empty', () => {
      expect(groupBy([], i => i)).toStrictEqual({});
    });
    it('some values', () => {
      expect(groupBy(['a', 'bb', 'ccc', 'dd'], i => i.length)).toStrictEqual({
        1: ['a'],
        2: ['bb', 'dd'],
        3: ['ccc'],
      });
    });
  });

  describe('sortBy', () => {
    let contacts;
    let contactA;
    let contactB;
    let contactC;
    const key = 'firstName';
    const secondSortKey = 'lastName';

    beforeEach(() => {
      contacts = [];
      contactA = {
        firstName: 'a',
        lastName: 'b',
      };
      contactB = {
        firstName: 'b',
        lastName: 'b',
      };
      contactC = {
        firstName: 'c',
        lastName: 'a',
      };
    });

    it('should not re-order the values', () => {
      contacts = [contactA, contactA];

      expect(contacts.sort(sortBy(key))).toStrictEqual([contactA, contactA]);
    });

    it('should re-order the values and return them in the expected order', () => {
      contacts = [contactC, contactB];

      expect(contacts.sort(sortBy(key))).toStrictEqual([contactB, contactC]);
    });

    it('should re-order the values and return them in the expected order', () => {
      contacts = [contactB, contactA];

      expect(contacts.sort(sortBy(key))).toStrictEqual([contactA, contactB]);
    });

    it('should sort contacts by lastName, where lastNames match, contacts should be further sorted by firstName', () => {
      contacts = [contactB, contactC, contactA];

      contacts = contacts.sort(sortBy(key)).sort(sortBy(secondSortKey));

      expect(contacts).toStrictEqual([contactC, contactA, contactB]);
    });
  });

  describe('checkFeatureEnabledAtSite', () => {
    const config = {
      sites: {
        prisonDisabled: {
          enabled: false,
          features: [],
        },
        prisonEnabledNoFeatures: {
          enabled: true,
          features: [],
        },
        prisonEnabledAdjudications: {
          enabled: true,
          features: ['adjudications'],
        },
        prisonEnabledApprovedVisitors: {
          enabled: true,
          features: ['approvedVisitors'],
        },
        prisonEnabledMoney: {
          enabled: true,
          features: ['money'],
        },
        prisonEnabledIncentives: {
          enabled: true,
          features: ['incentives'],
        },
        prisonEnabledTimetable: {
          enabled: true,
          features: ['timetable'],
        },
        prisonEnabledVisits: {
          enabled: true,
          features: ['visits'],
        },
      },
    };

    test.each([
      { site: 'prisonDisabled', feature: 'adjudications', expected: false },
      {
        site: 'prisonEnabledNoFeatures',
        feature: 'adjudications',
        expected: false,
      },
      {
        site: 'prisonEnabledAdjudications',
        feature: 'adjudications',
        expected: true,
      },
    ])(
      'checkFeatureEnabledAtSite($site, $feature) should return $expected',
      ({ site, feature, expected }) => {
        expect(checkFeatureEnabledAtSite(site, feature, config)).toBe(expected);
      },
    );
  });
});
