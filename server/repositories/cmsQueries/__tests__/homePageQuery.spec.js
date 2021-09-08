const { HomepageQuery } = require('../homePageQuery');

describe('Homepage query', () => {
  const query = new HomepageQuery('berwyn', 'prisoner', 1);
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        '/jsonapi/prison/berwyn/node/featured_articles?include=field_moj_featured_tile_large.field_moj_thumbnail_image%2Cfield_moj_featured_tile_large.field_image%2Cfield_moj_featured_tile_small.field_moj_thumbnail_image%2Cfield_moj_featured_tile_small.field_image&page%5Blimit%5D=1&fields%5Bnode--featured_articles%5D=title%2Cdrupal_internal__nid%2Cfield_moj_featured_tile_large%2Cfield_moj_featured_tile_small&fields%5Bnode--page%5D=drupal_internal__nid%2Cfield_moj_thumbnail_image%2Cfield_image%2Ctitle%2Cfield_moj_description%2Cfield_moj_series&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Cfield_moj_thumbnail_image%2Cfield_image%2Ctitle%2Cfield_moj_description%2Cfield_moj_series&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Cfield_moj_thumbnail_image%2Cfield_image%2Ctitle%2Cfield_moj_description%2Cfield_moj_series&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Cfield_moj_thumbnail_image%2Cfield_image%2Ctitle%2Cfield_moj_description%2Cfield_moj_series&fields%5Bnode--landing_page%5D=drupal_internal__nid%2Cfield_moj_thumbnail_image%2Cfield_image%2Ctitle%2Cfield_moj_description%2Cfield_moj_series&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Curi%2Cimage_style_uri',
      );
    });
  });

  describe('transformEach', () => {
    it('should return correct small tile structure', async () => {
      const contentItem = {
        fieldMojFeaturedTileLarge: [],
        fieldMojFeaturedTileSmall: [
          {
            drupalInternal_Nid: '10001',
            type: 'moj_video_item',
            fieldMojSeries: {},
            title: 'Lower Abs workout',
            fieldMojDescription: { summary: 'Intense lower core workout' },
            fieldMojThumbnailImage: {
              uri: { url: 'https://cloud-platform-c3b3.eu-west-2' },
              resourceIdObjMeta: { alt: 'Picture of core workout' },
            },
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
            contentType: 'moj_video_item',
            isSeries: true,
            title: 'Lower Abs workout',
            summary: 'Intense lower core workout',
            image: {
              url: 'https://cloud-platform-c3b3.eu-west-2',
              alt: 'Picture of core workout',
            },
          },
        ],
      });
    });

    it('should show small tile image when provided', async () => {
      const contentItem = {
        fieldMojFeaturedTileLarge: [],
        fieldMojFeaturedTileSmall: [
          {
            drupalInternal_Nid: '10001',
            type: 'moj_video_item',
            fieldMojSeries: {},
            title: 'Lower Abs workout',
            fieldMojDescription: { summary: 'Intense lower core workout' },
            fieldMojThumbnailImage: {
              uri: { url: 'https://cloud-platform-c3b3.eu-west-2' },
              resourceIdObjMeta: { alt: 'Picture of core workout' },
              imageStyleUri: [
                { tile_large: 'large-image', tile_small: 'small-image' },
              ],
            },
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
            contentType: 'moj_video_item',
            isSeries: true,
            title: 'Lower Abs workout',
            summary: 'Intense lower core workout',
            image: {
              url: 'small-image',
              alt: 'Picture of core workout',
            },
          },
        ],
      });
    });

    it('should show large tile image when provided', async () => {
      const contentItem = {
        fieldMojFeaturedTileLarge: [
          {
            drupalInternal_Nid: '10001',
            type: 'moj_video_item',
            fieldMojSeries: {},
            title: 'Lower Abs workout',
            fieldMojDescription: { summary: 'Intense lower core workout' },
            fieldMojThumbnailImage: {
              uri: { url: 'https://cloud-platform-c3b3.eu-west-2' },
              resourceIdObjMeta: { alt: 'Picture of core workout' },
              imageStyleUri: [
                { tile_large: 'large-image', tile_small: 'small-image' },
              ],
            },
          },
        ],
        fieldMojFeaturedTileSmall: [],
      };

      expect(query.transformEach(contentItem)).toStrictEqual({
        upperFeatured: {
          id: '10001',
          contentUrl: '/content/10001',
          contentType: 'moj_video_item',
          isSeries: true,
          title: 'Lower Abs workout',
          summary: 'Intense lower core workout',
          image: {
            url: 'large-image',
            alt: 'Picture of core workout',
          },
        },
        lowerFeatured: undefined,
        smallTiles: [],
      });
    });

    it('should return correct upper/lower featured tile structures', async () => {
      const contentItem = {
        fieldMojFeaturedTileLarge: [
          {
            drupalInternal_Nid: '10002',
            type: 'moj_video_item',
            fieldMojSeries: {},
            title: 'Yoga',
            fieldMojDescription: { summary: 'Yoga workout' },
            fieldMojThumbnailImage: {
              uri: { url: 'https://cloud-platform-c3b3.eu-west-2' },
              resourceIdObjMeta: { alt: 'Picture of Yoga workout' },
            },
          },
          {
            drupalInternal_Nid: '10003',
            type: 'moj_video_item',
            title: 'Lower Abs workout',
            fieldMojDescription: { summary: 'Intense lower core workout' },
            fieldMojThumbnailImage: {
              uri: { url: 'https://cloud-platform-c3b3.eu-west-2' },
              resourceIdObjMeta: { alt: 'Picture of core workout' },
            },
          },
        ],
        fieldMojFeaturedTileSmall: [],
      };

      expect(query.transformEach(contentItem)).toStrictEqual({
        upperFeatured: {
          id: '10002',
          contentUrl: '/content/10002',
          contentType: 'moj_video_item',
          isSeries: true,
          title: 'Yoga',
          summary: 'Yoga workout',
          image: {
            url: 'https://cloud-platform-c3b3.eu-west-2',
            alt: 'Picture of Yoga workout',
          },
        },
        lowerFeatured: {
          id: '10003',
          contentUrl: '/content/10003',
          contentType: 'moj_video_item',
          isSeries: false,
          title: 'Lower Abs workout',
          summary: 'Intense lower core workout',
          image: {
            url: 'https://cloud-platform-c3b3.eu-west-2',
            alt: 'Picture of core workout',
          },
        },
        smallTiles: [],
      });
    });
  });
});
