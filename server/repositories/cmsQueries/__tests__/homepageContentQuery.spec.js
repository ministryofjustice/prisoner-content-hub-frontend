const { HomepageContentQuery } = require('../homepageContentQuery');

describe('HomepageContent query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const PAGE_LIMIT = 4;
  let query;

  beforeEach(() => {
    query = new HomepageContentQuery(ESTABLISHMENTNAME, PAGE_LIMIT);
  });

  describe('path', () => {
    it('should return correct path', () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/node/homepage?include=field_featured_tiles.field_moj_thumbnail_image%2Cfield_featured_tiles&page%5Blimit%5D=4&fields%5Bnode--field_featured_tiles%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri`,
      );
    });

    it("should return a path containing the default page limit of '4' when a page limit is not provided", () => {
      const queryWithoutPageLimit = new HomepageContentQuery(ESTABLISHMENTNAME);
      expect(queryWithoutPageLimit.path()).toContain('page%5Blimit%5D=4');
    });

    it('should return a path containing the specifi page limit value when one is provided', () => {
      const queryWithPageLimit = new HomepageContentQuery(ESTABLISHMENTNAME, 8);
      expect(queryWithPageLimit.path()).toContain('page%5Blimit%5D=8');
    });
  });

  describe('transformEach', () => {
    let item;
    let data;
    let unpublishedNode;

    beforeEach(() => {
      item = {
        fieldFeaturedTiles: [
          {
            type: 'node--moj_video_item',
            drupalInternal_Nid: 111111,
            title: 'A title',
            path: {
              alias: '/content/111111',
              pid: 111111,
              langcode: 'en',
            },
            fieldMojDescription: {
              summary: 'A description',
            },
            fieldMojThumbnailImage: {
              imageStyleUri: [
                {
                  tile_small: 'small-image-url',
                },
              ],
              resourceIdObjMeta: {
                alt: 'Alt text',
              },
            },
          },
          {
            type: 'node--moj_radio_item',
            drupalInternal_Nid: 222222,
            title: 'A title',
            path: {
              alias: '/content/222222',
              pid: 222222,
              langcode: 'en',
            },
            fieldMojDescription: {
              summary: 'A description',
            },
            fieldMojThumbnailImage: {
              imageStyleUri: [
                {
                  tile_small: 'small-image-url',
                },
              ],
              resourceIdObjMeta: {
                alt: 'Alt text',
              },
            },
          },
        ],
      };

      data = [
        {
          contentType: 'video',
          contentUrl: '/content/111111',
          displayUrl: undefined,
          externalContent: false,
          id: 111111,
          image: {
            alt: 'Alt text',
            url: 'small-image-url',
          },
          summary: 'A description',
          title: 'A title',
        },
        {
          contentType: 'radio',
          contentUrl: '/content/222222',
          displayUrl: undefined,
          externalContent: false,
          id: 222222,
          image: {
            alt: 'Alt text',
            url: 'small-image-url',
          },
          summary: 'A description',
          title: 'A title',
        },
      ];

      unpublishedNode = {
        type: 'node--page',
        id: '11111-11111-11111-11111-11111',
        resourceIdObjMeta: {
          target_type: 'node',
          drupal_internal__target_id: 111111,
        },
      };
    });

    it('should create correct structure', () => {
      expect(query.transformEach(item)).toStrictEqual({
        featuredContent: {
          data,
        },
      });
    });

    it('should contain the expected number of objects when unpublished nodes are filtered out the data', () => {
      item.fieldFeaturedTiles.push(unpublishedNode);

      expect(query.transformEach(item).featuredContent.data).toHaveLength(
        data.length,
      );
    });

    it('should remove unpublished nodes from the data', () => {
      item.fieldFeaturedTiles.push(unpublishedNode);

      expect(query.transformEach(item)).toStrictEqual({
        featuredContent: {
          data,
        },
      });
    });
  });
});
