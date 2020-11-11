const { KeyWorker } = require('../keyWorker');
const {
  placeholders: { DEFAULT },
} = require('../../../../utils/enums');

describe('KeyWorker', () => {
  it('Should handle an empty response', () => {
    const keyWorker = KeyWorker.from();

    expect(keyWorker.firstName).not.toBeDefined();
    expect(keyWorker.lastName).not.toBeDefined();

    const formatted = keyWorker.format();

    expect(formatted.current).toBe(DEFAULT);
    expect(formatted.lastMeeting).toBe(DEFAULT);
  });

  it('should handle an incomplete response', () => {
    const response = {
      firstName: 'DONALD',
    };

    const formatted = KeyWorker.from(response).format();

    expect(formatted).toStrictEqual(
      {
        current: 'Donald',
        lastMeeting: DEFAULT,
      },
      'Should handle a partial name',
    );
  });

  it('should format data when passed', () => {
    const response = {
      firstName: 'DONALD',
      lastName: 'DUCK',
    };

    const formatted = KeyWorker.from(response).format();

    expect(formatted).toStrictEqual({
      current: 'Donald Duck',
      lastMeeting: DEFAULT,
    });
  });
});
