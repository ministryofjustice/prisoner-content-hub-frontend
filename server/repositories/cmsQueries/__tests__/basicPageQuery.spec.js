const { BasicPageQuery } = require('../basicPageQuery');

describe('Basic page query', () => {
  const query = new BasicPageQuery('https://cms/content/1234');
  describe('url', () => {
    it('should create correct path', async () => {
      expect(query.url()).toStrictEqual(
        'https://cms/content/1234?fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_stand_first%2Cfield_moj_secondary_tags%2Cfield_moj_series%2Cfield_moj_top_level_categories',
      );
    });
  });

  describe('transform', () => {
    it('should create correct basic page structure', async () => {
      const basicPage = {
        drupalInternal_Nid: 5923,
        title: 'Novus',
        type: 'node--node--page',
        fieldMojDescription: { processed: 'Education content for prisoners' },
        fieldMojStandFirst: 'Education',
        fieldMojTopLevelCategories: [
          { resourceIdObjMeta: { drupal_internal__target_id: 1234 } },
        ],
        fieldMojSecondaryTags: [
          { resourceIdObjMeta: { drupal_internal__target_id: 2345 } },
        ],
      };

      expect(query.transform(basicPage)).toStrictEqual({
        id: 5923,
        title: 'Novus',
        contentType: 'page',
        description: 'Education content for prisoners',
        standFirst: 'Education',
        categories: [1234],
        secondaryTags: [2345],
      });
    });
  });
});
