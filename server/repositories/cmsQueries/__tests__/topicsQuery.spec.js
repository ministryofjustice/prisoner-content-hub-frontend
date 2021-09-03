const { TopicsQuery } = require('../topicsQuery');

describe('Topics query', () => {
  const query = new TopicsQuery('berwyn');
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        '/jsonapi/prison/berwyn/taxonomy_term?filter%5Bvid.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bpath%5D=vid.meta.drupal_internal__target_id&filter%5Bvid.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B0%5D=moj_categories&filter%5Bvid.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B1%5D=tags&filter%5Bvid.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Boperator%5D=IN&page%5Blimit%5D=100&sort=name&fields%5Btaxonomy_term--tags%5D=drupal_internal__tid%2Cname%2Cdescription&fields%5Btaxonomy_term--moj_categories%5D=name%2Cdescription%2Cfield_legacy_landing_page',
      );
    });
  });

  describe('transform', () => {
    it('should create correct tag structure', async () => {
      const tagItem = {
        drupalInternal_Tid: 1234,
        name: 'prisoner',
        description: { processed: 'Living in prison' },
        type: 'taxonomy_term--tags',
      };

      expect(query.transformEach(tagItem)).toStrictEqual({
        id: 1234,
        linkText: 'prisoner',
        description: 'Living in prison',
        href: '/tags/1234',
      });
    });
    it('should create correct category structure', async () => {
      const categoryItem = {
        name: '2',
        description: { processed: '3' },
        type: '4',
        fieldLegacyLandingPage: {
          resourceIdObjMeta: { drupal_internal__target_id: '1' },
        },
      };

      expect(query.transformEach(categoryItem)).toStrictEqual({
        description: '3',
        href: '/content/1',
        id: '1',
        linkText: '2',
      });
    });
  });
});
