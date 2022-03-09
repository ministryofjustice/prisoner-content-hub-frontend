const { LinkPageQuery } = require('../linkPageQuery');

describe('Link page query', () => {
  const query = new LinkPageQuery('berwyn');
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.url()).toStrictEqual(
        'berwyn?fields%5Bnode--external_link%5D=title%2Cdrupal_internal__nid%2Cfield_show_interstitial_page%2Cfield_url',
      );
    });
  });

  describe('transform', () => {
    it('should create correct structure', async () => {
      const link = {
        drupalInternal_Nid: 1234,
        title: 'BBC weather',
        fieldUrl: { uri: 'http://some-url' },
        fieldShowInterstitialPage: 'on',
      };

      expect(query.transform(link)).toStrictEqual({
        id: 1234,
        intercept: true,
        title: 'BBC weather',
        url: 'http://some-url',
      });
    });
  });
});
