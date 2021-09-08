const { SearchQuery } = require('../searchQuery');

describe('search query', () => {
  const query = new SearchQuery('berwyn', 'prisoner', 1);
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        '/jsonapi/prison/berwyn/index/content_for_search?filter%5Bfulltext%5D=prisoner&page%5Blimit%5D=1',
      );
    });
  });

  describe('transform', () => {
    it('should create correct structure', async () => {
      const item = {
        title: 'Prisoners in Prison',
        drupalInternal_Nid: 1234,
        fieldMojDescription: { summary: 'Lived experiences in prison' },
      };

      expect(query.transformEach(item)).toStrictEqual({
        summary: 'Lived experiences in prison',
        title: 'Prisoners in Prison',
        url: '/content/1234',
      });
    });
  });
});
