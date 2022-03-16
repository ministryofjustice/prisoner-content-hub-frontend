const { TopicsQuery } = require('../topicsQuery');

describe('Topics query', () => {
  const query = new TopicsQuery('berwyn');
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        '/jsonapi/prison/berwyn/taxonomy_term?filter%5Bvid.meta.drupal_internal__target_id%5D=tags&page%5Blimit%5D=100&sort=name&fields%5Btaxonomy_term--tags%5D=drupal_internal__tid%2Cname',
      );
    });
  });

  describe('transform', () => {
    it('should create correct structure', async () => {
      const items = [
        {
          drupalInternal_Tid: 1,
          name: 'Castle',
          type: 'taxonomy_term--tags',
        },
        {
          drupalInternal_Tid: 2,
          name: 'Apple',
          type: 'taxonomy_term--tags',
        },
        {
          drupalInternal_Tid: 3,
          name: 'Beach',
          type: 'taxonomy_term--tags',
        },
        {
          drupalInternal_Tid: 4,
          name: 'basket',
          type: 'taxonomy_term--tags',
        },
      ];

      expect(query.transform(items)).toStrictEqual({
        A: [
          {
            href: '/tags/2',
            id: 2,
            linkText: 'Apple',
          },
        ],
        B: [
          {
            href: '/tags/3',
            id: 3,
            linkText: 'Beach',
          },
          {
            href: '/tags/4',
            id: 4,
            linkText: 'basket',
          },
        ],
        C: [
          {
            href: '/tags/1',
            id: 1,
            linkText: 'Castle',
          },
        ],
      });
    });
  });
});
