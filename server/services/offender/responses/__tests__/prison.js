const { Prison } = require('../prison');

describe('Prison', () => {
  it('Should format Prison agency data', () => {
    const response = {
      agencyId: 'TST',
      description: 'Test Prison (HMP)',
      longDescription: 'HMP TEST PRISON',
    };

    const formatted = Prison.from(response).format();

    expect(formatted.prisonId).toBe('TST');
    expect(formatted.description).toBe('Test Prison (HMP)');
    expect(formatted.longDescription).toBe('HMP Test Prison');
  });
});
