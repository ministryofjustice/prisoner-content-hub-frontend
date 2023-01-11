const { TopicHeaderPageQuery } = require('../topicHeaderPageQuery');

describe('Secondary tag with no defined related content page query', () => {
  const query = new TopicHeaderPageQuery('https://cms/content/1234');
  describe('url', () => {
    it('should create the correct url', async () => {
      expect(query.url()).toStrictEqual(
        'https://cms/content/1234?include=field_moj_thumbnail_image&fields%5Btaxonomy_term--topics%5D=name%2Cdescription%2Cdrupal_internal__tid%2Cfield_moj_thumbnail_image%2Cpath%2Cpublished_at',
      );
    });
  });

  describe('transform', () => {
    it('should create correct topic page structure', async () => {
      const page = {
        drupalInternal_Tid: `1001`,
        name: `name1`,
        type: 'taxonomy_term--topics',
        description: { processed: `description1` },
        fieldMojThumbnailImage: {
          imageStyleUri: [{ tile_large: `tile_large1` }],
          resourceIdObjMeta: { alt: `alt1` },
        },
        displayUrl: undefined,
        path: { alias: 'tags/1' },
      };

      expect(query.transform(page)).toStrictEqual({
        id: `1001`,
        contentType: 'topic',
        title: `name1`,
        summary: undefined,
        image: {
          url: `tile_large1`,
          alt: `alt1`,
        },
        isNew: false,
        displayUrl: undefined,
        externalContent: false,
        contentUrl: 'tags/1',
      });
    });
  });
});
