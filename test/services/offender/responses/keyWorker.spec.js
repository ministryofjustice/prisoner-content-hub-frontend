const {
  KeyWorker,
} = require('../../../../server/services/offender/responses/keyWorker');

const DEFAULT_VALUE = 'Unavailable';

describe('KeyWorker', () => {
  it('Should handle an empty response', () => {
    const keyWorker = KeyWorker.from();

    expect(keyWorker.firstName).to.not.exist;
    expect(keyWorker.lastName).to.not.exist;

    const formatted = keyWorker.format();

    expect(formatted.current).to.equal(DEFAULT_VALUE);
    expect(formatted.lastMeeting).to.equal(DEFAULT_VALUE);
  });

  it('should handle an incomplete response', () => {
    const response = {
      firstName: 'DONALD',
    };

    const formatted = KeyWorker.from(response).format();

    expect(formatted).to.eql(
      {
        current: 'Donald',
        lastMeeting: DEFAULT_VALUE,
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

    expect(formatted).to.eql({
      current: 'Donald Duck',
      lastMeeting: DEFAULT_VALUE,
    });
  });
});
