const { HomepageQuery } = require('../homePageQuery');

describe('Homepage query', () => {
  const query = new HomepageQuery('berwyn', 'prisoner', 1);
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        '/jsonapi/prison/berwyn/node/featured_articles?include=field_featured_tile_large.field_moj_thumbnail_image%2Cfield_featured_tile_small.field_moj_thumbnail_image&page%5Blimit%5D=1&fields%5Bnode--featured_articles%5D=title%2Cdrupal_internal__nid%2Cfield_featured_tile_large%2Cfield_featured_tile_small&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Cpublished_at&fields%5Btaxonomy_term--series%5D=drupal_internal__tid%2Cname%2Cdescription%2Cpath%2Cfield_moj_thumbnail_image&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri',
      );
    });
  });

  describe('transformEach', () => {
    it('should return correct small tile structure', async () => {
      const contentItem = {
        fieldFeaturedTileLarge: [],
        fieldFeaturedTileSmall: [
          {
            drupalInternal_Nid: '10001',
            type: 'moj_video_item',
            fieldMojSeries: {},
            title: 'Lower Abs workout',
            fieldMojDescription: { summary: 'Intense lower core workout' },
            fieldMojThumbnailImage: {
              imageStyleUri: [{ tile_small: 'small-image' }],
              resourceIdObjMeta: { alt: 'Picture of core workout' },
            },
            path: { alias: '/content/10001' },
          },
        ],
      };

      expect(query.transformEach(contentItem)).toStrictEqual({
        upperFeatured: undefined,
        lowerFeatured: undefined,
        smallTiles: [
          {
            id: '10001',
            contentUrl: '/content/10001',
            contentType: 'video',
            title: 'Lower Abs workout',
            summary: 'Intense lower core workout',
            image: {
              url: 'small-image',
              alt: 'Picture of core workout',
            },
            isNew: false,
            displayUrl: undefined,
            externalContent: false,
          },
        ],
      });
    });

    it('should return correct upper/lower featured tile structures', async () => {
      const contentItem = {
        fieldFeaturedTileLarge: [
          {
            drupalInternal_Nid: '10002',
            type: 'link',
            fieldMojSeries: {},
            title: 'Yoga',
            fieldShowInterstitialPage: true,
            fieldMojDescription: { summary: 'Yoga workout' },
            fieldMojThumbnailImage: {
              resourceIdObjMeta: { alt: 'Picture of Yoga workout' },
              imageStyleUri: [
                { tile_large: 'large-image', tile_small: 'small-image' },
              ],
            },
            displayUrl: 'www.yoga.com',
            path: { alias: '/tags/10002' },
          },
          {
            drupalInternal_Tid: '10003',
            type: 'taxonomy_term--series',
            name: 'Bob and Beyond',
            description: { processed: 'Music' },
            fieldMojThumbnailImage: {
              resourceIdObjMeta: { alt: 'Bob and Beyond' },
              imageStyleUri: [
                { tile_large: 'large-image', tile_small: 'small-image' },
              ],
            },
            path: { alias: '/tags/10003' },
          },
        ],
        fieldFeaturedTileSmall: [],
      };

      expect(query.transformEach(contentItem)).toStrictEqual({
        upperFeatured: {
          id: '10002',
          contentUrl: '/tags/10002',
          contentType: 'external_link',
          title: 'Yoga',
          summary: 'Yoga workout',
          image: {
            url: 'large-image',
            alt: 'Picture of Yoga workout',
          },
          isNew: false,
          displayUrl: undefined,
          externalContent: true,
        },
        lowerFeatured: {
          id: '10003',
          contentUrl: '/tags/10003',
          contentType: 'series',
          title: 'Bob and Beyond',
          summary: 'Music',
          image: {
            url: 'large-image',
            alt: 'Bob and Beyond',
          },
          isNew: false,
          displayUrl: undefined,
          externalContent: false,
        },
        smallTiles: [],
      });
    });
  });
});
