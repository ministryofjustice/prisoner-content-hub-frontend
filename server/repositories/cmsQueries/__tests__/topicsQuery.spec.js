const { TopicsQuery } = require('../topicsQuery');

describe('Topics query', () => {
  const query = new TopicsQuery('berwyn', 'en');
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        '/en/jsonapi/prison/berwyn/taxonomy_term?filter%5Bvid.meta.drupal_internal__target_id%5D=topics&page%5Blimit%5D=100&sort=name&fields%5Btaxonomy_term--topics%5D=drupal_internal__tid%2Cname',
      );
    });
  });

  describe('transform', () => {
    it('should create correct structure', async () => {
      const item = {
        drupalInternal_Tid: 2,
        name: 'Apple',
        type: 'taxonomy_term--topics',
      };
      expect(query.transformEach(item)).toStrictEqual({
        href: '/tags/2',
        id: 2,
        linkText: 'Apple',
      });
    });
  });
});
