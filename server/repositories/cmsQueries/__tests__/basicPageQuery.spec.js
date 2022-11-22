const { BasicPageQuery } = require('../basicPageQuery');

describe('Basic page query', () => {
  const query = new BasicPageQuery('https://cms/content/1234');
  describe('url', () => {
    it('should create correct path', async () => {
      expect(query.url()).toStrictEqual(
        'https://cms/content/1234?include=field_topics%2Cfield_moj_top_level_categories&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Ccreated%2Cfield_moj_description%2Cfield_moj_stand_first%2Cfield_topics%2Cfield_moj_series%2Cfield_moj_top_level_categories%2Cfield_exclude_feedback%2Cbreadcrumbs&fields%5Btaxonomy_term--topics%5D=drupal_internal__tid%2Cname&fields%5Btaxonomy_term--moj_categories%5D=drupal_internal__tid%2Cname',
      );
    });
  });

  describe('transform', () => {
    it('should create correct basic page structure', async () => {
      const basicPage = {
        drupalInternal_Nid: 5923,
        title: 'Novus',
        type: 'node--node--page',
        breadcrumbs: [{ uri: 'parent1Url', title: 'parent1' }],
        created: '2020-01-03T01:02:30',
        fieldMojDescription: { processed: 'Education content for prisoners' },
        fieldExcludeFeedback: true,
        fieldMojStandFirst: 'Education',
        fieldMojTopLevelCategories: {
          resourceIdObjMeta: { drupal_internal__target_id: 1234 },
          name: 'steve',
          id: 101,
        },
        fieldTopics: [{ drupalInternal_Tid: 2345, name: 'carol', id: 101 }],
      };

      expect(query.transform(basicPage)).toStrictEqual({
        id: 5923,
        title: 'Novus',
        created: '2020-01-03T01:02:30',
        contentType: 'page',
        breadcrumbs: [{ href: 'parent1Url', text: 'parent1' }],
        description: 'Education content for prisoners',
        excludeFeedback: true,
        standFirst: 'Education',
        categories: { id: 1234, name: 'steve', uuid: 101 },
        topics: [{ id: 2345, name: 'carol', uuid: 101 }],
      });
    });

    it('handles missing moj description', async () => {
      const basicPage = {
        drupalInternal_Nid: 5923,
        created: '2020-01-03T01:02:30',
        title: 'Novus',
        type: 'node--node--page',
        breadcrumbs: [{ uri: 'parent1Url', title: 'parent1' }],
        fieldExcludeFeedback: true,
        fieldMojStandFirst: 'Education',
        fieldMojTopLevelCategories: {
          resourceIdObjMeta: { drupal_internal__target_id: 1234 },
          name: 'steve',
          id: 101,
        },
        fieldTopics: [{ drupalInternal_Tid: 2345, name: 'carol', id: 101 }],
      };

      expect(query.transform(basicPage)).toStrictEqual({
        id: 5923,
        created: '2020-01-03T01:02:30',
        title: 'Novus',
        contentType: 'page',
        breadcrumbs: [{ href: 'parent1Url', text: 'parent1' }],
        description: undefined,
        excludeFeedback: true,
        standFirst: 'Education',
        categories: { id: 1234, name: 'steve', uuid: 101 },
        topics: [{ id: 2345, name: 'carol', uuid: 101 }],
      });
    });
  });
});
