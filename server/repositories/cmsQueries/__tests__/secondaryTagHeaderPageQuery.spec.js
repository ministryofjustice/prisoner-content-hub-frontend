const {
  SecondaryTagHeaderPageQuery,
} = require('../secondaryTagHeaderPageQuery');

describe('Secondary tag with no defined related content page query', () => {
  const query = new SecondaryTagHeaderPageQuery('https://cms/content/1234');
  describe('url', () => {
    it('should create the correct url', async () => {
      expect(query.url()).toStrictEqual(
        'https://cms/content/1234?include=field_featured_image&fields%5Btaxonomy_term--tags%5D=name%2Cdescription%2Cdrupal_internal__tid%2Cfield_featured_image',
      );
    });
  });

  describe('transform', () => {
    it('should create correct secondary tag page structure', async () => {
      const page = {
        drupalInternal_Tid: `1001`,
        name: `name1`,
        description: { processed: `description1` },
        fieldFeaturedImage: {
          imageStyleUri: [{ tile_large: `tile_large1` }],
          resourceIdObjMeta: { alt: `alt1` },
        },
      };

      expect(query.transform(page)).toStrictEqual({
        id: `1001`,
        contentType: 'tags',
        name: `name1`,
        description: `description1`,
        image: {
          url: `tile_large1`,
          alt: `alt1`,
        },
      });
    });
  });
});
