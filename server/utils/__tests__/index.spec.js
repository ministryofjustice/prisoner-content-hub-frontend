const { capitalize, capitalizeAll, capitalizePersonName } = require('../index');

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
});
