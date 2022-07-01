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
        `/jsonapi/prison/${ESTABLISHMENTNAME}/node/homepage?include=field_featured_tiles.field_moj_thumbnail_image%2Cfield_featured_tiles%2Cfield_large_update_tile%2Cfield_key_info_tiles&page%5Blimit%5D=4&fields%5Bnode--field_featured_tiles%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--field_key_info_tiles%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri`,
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
    let processedContent1;
    let processedContent2;
    let processedContent3;
    let rawContent1;
    let rawContent2;
    let rawContent3;

    beforeEach(() => {
      rawContent1 = {
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
              tile_small: 'image-url',
              tile_large: 'image-url',
            },
          ],
          resourceIdObjMeta: {
            alt: 'Alt text',
          },
        },
      };
      rawContent2 = {
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
      };
      rawContent3 = {
        type: 'node--moj_radio_item',
        drupalInternal_Nid: 333333,
        title: 'A long title that will be cropped',
        path: {
          alias: '/content/333333',
          pid: 333333,
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
      };
      item = {
        fieldFeaturedTiles: [rawContent1, rawContent2],
        fieldKeyInfoTiles: [rawContent3, rawContent2, rawContent1],
        fieldLargeUpdateTile: rawContent1,
      };

      processedContent1 = {
        contentType: 'video',
        contentUrl: '/content/111111',
        displayUrl: undefined,
        externalContent: false,
        id: 111111,
        image: {
          alt: 'Alt text',
          url: 'image-url',
        },
        isNew: false,
        summary: 'A description',
        title: 'A title',
      };
      processedContent2 = {
        contentType: 'radio',
        contentUrl: '/content/222222',
        displayUrl: undefined,
        externalContent: false,
        id: 222222,
        image: {
          alt: 'Alt text',
          url: 'small-image-url',
        },
        isNew: false,
        summary: 'A description',
        title: 'A title',
      };
      processedContent3 = {
        contentType: 'radio',
        contentUrl: '/content/333333',
        displayUrl: undefined,
        externalContent: false,
        id: 333333,
        image: {
          alt: 'Alt text',
          url: 'small-image-url',
        },
        isNew: false,
        summary: 'A description',
        title: 'A long title that will be...',
      };
    });

    it('should create the correct structure', () => {
      expect(query.transformEach(item)).toStrictEqual({
        featuredContent: {
          data: [processedContent1, processedContent2],
        },
        keyInfo: {
          data: [processedContent3, processedContent2, processedContent1],
        },
        largeUpdateTile: processedContent1,
      });
    });
    it('should handle no large tile data', () => {
      item.fieldLargeUpdateTile = null;
      const processed = query.transformEach(item);
      expect(processed.largeUpdateTile).toBe(null);
    });

    describe('with unpublished nodes', () => {
      let unpublishedNode;
      let processed;
      beforeEach(() => {
        unpublishedNode = {
          type: 'node--page',
          id: '11111-11111-11111-11111-11111',
          resourceIdObjMeta: {
            target_type: 'node',
            drupal_internal__target_id: 111111,
          },
        };
        item = {
          fieldFeaturedTiles: [rawContent1, unpublishedNode, rawContent2],
          fieldKeyInfoTiles: [
            unpublishedNode,
            rawContent2,
            rawContent1,
            unpublishedNode,
          ],
          fieldLargeUpdateTile: rawContent1,
        };
        processed = query.transformEach(item);
      });
      it('featuredContent should contain the expected number of objects when unpublished nodes are filtered out the data', () => {
        expect(processed.featuredContent.data).toHaveLength(2);
      });

      it('keyInfo should contain the expected number of objects when unpublished nodes are filtered out the data', () => {
        expect(processed.keyInfo.data).toHaveLength(2);
      });

      it('should remove unpublished nodes from the data and process the rest', () => {
        item.fieldFeaturedTiles.push(unpublishedNode);

        expect(query.transformEach(item)).toStrictEqual({
          featuredContent: { data: [processedContent1, processedContent2] },
          keyInfo: { data: [processedContent2, processedContent1] },
          largeUpdateTile: processedContent1,
        });
      });
    });
  });
});
