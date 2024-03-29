const { SeriesHeaderPageQuery } = require('../seriesHeaderPageQuery');

describe('Series with no defined related content page query', () => {
  const query = new SeriesHeaderPageQuery('https://cms/content/1234');
  describe('url', () => {
    it('should create the correct url', async () => {
      expect(query.url()).toStrictEqual(
        'https://cms/content/1234?include=field_moj_thumbnail_image&fields%5Btaxonomy_term--series%5D=name%2Cdescription%2Cdrupal_internal__tid%2Cfield_moj_thumbnail_image%2Cpath%2Cpublished_at',
      );
    });
  });

  describe('transform', () => {
    it('should create correct series page structure', async () => {
      const page = {
        drupalInternal_Tid: `1001`,
        name: `name1`,
        type: 'taxonomy_term--series',
        description: { processed: `description1` },
        fieldMojThumbnailImage: {
          imageStyleUri: { tile_large: `tile_large1` },
          resourceIdObjMeta: { alt: `alt1` },
        },
        displayUrl: undefined,
        path: { alias: '/tags/123' },
      };

      expect(query.transform(page)).toStrictEqual({
        id: `1001`,
        contentType: 'series',
        title: `name1`,
        displayUrl: undefined,
        summary: 'description1',
        externalContent: false,
        image: {
          url: `tile_large1`,
          alt: `alt1`,
        },
        isNew: false,
        contentUrl: '/tags/123',
      });
    });
  });
});
