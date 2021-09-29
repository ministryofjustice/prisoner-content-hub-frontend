const {
  capitalize,
  capitalizeAll,
  capitalizePersonName,
  fillContentItems,
} = require('../index');

describe('Utils', () => {
  describe('fillContentItems', () => {
    [
      {
        inputSize: 4,
        outputSize: 4,
      },
      {
        inputSize: 1,
        outputSize: 4,
      },
      {
        inputSize: 0,
        outputSize: 0,
      },
      {
        inputSize: 5,
        outputSize: 8,
      },
    ].forEach(test => {
      it(`should return an array of size "${test.outputSize}" for input size of "${test.inputSize}"`, () => {
        expect(fillContentItems(new Array(test.inputSize)).length).toBe(
          test.outputSize,
        );
      });
    });
  });

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
