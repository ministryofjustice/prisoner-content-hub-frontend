const { getPagination } = require('../../../utils/jsonApi');
const { CategoryContentQuery } = require('../categoryContentQuery');

describe('Category collection query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const UUID = `42`;
  const LIMIT = 17;
  const PAGE = 2;
  const query = new CategoryContentQuery(ESTABLISHMENTNAME, UUID, LIMIT, PAGE);
  describe('path', () => {
    it('should create correct path', () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/node?filter%5Bfield_moj_top_level_categories.id%5D=${UUID}&filter%5Bfield_not_in_series%5D=1&include=field_moj_thumbnail_image&sort=-created&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cpath&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cpath&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cpath&fields%5Bmoj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cpath&${getPagination(
          PAGE,
          LIMIT,
        )}`,
      );
    });
  });

  describe('transform', () => {
    const CONTENT_ITEM_VIDEO = {
      drupalInternal_Nid: 101,
      title: `title_101`,
      type: 'node--moj_video_item',
      fieldMojDescription: { summary: `summary_101` },
      fieldMojThumbnailImage: {
        imageStyleUri: [{}, { tile_small: `tile_small_101` }],
        resourceIdObjMeta: { alt: `alt_101` },
      },
      path: { alias: `/content/101` },
      displayUrl: undefined,
      externalContent: false,
    };
    const TILE_VIDEO = {
      id: 101,
      title: `title_101`,
      contentType: 'video',
      summary: `summary_101`,
      contentUrl: `/content/101`,
      image: {
        url: `tile_small_101`,
        alt: `alt_101`,
      },
      isNew: false,
      displayUrl: undefined,
      externalContent: false,
    };

    it('should return null if the Array is empty', async () => {
      expect(query.transform([])).toBeNull();
    });

    it('should return an array of small tiles and identify further pages', () => {
      const result = query.transform(
        [CONTENT_ITEM_VIDEO, CONTENT_ITEM_VIDEO, CONTENT_ITEM_VIDEO],
        { next: 'NextPageURL' },
      );
      expect(result).toStrictEqual({
        data: [TILE_VIDEO, TILE_VIDEO, TILE_VIDEO],
        isLastPage: false,
      });
    });
    it('should return an array of small tiles and identify a last page', () => {
      const result = query.transform(
        [
          CONTENT_ITEM_VIDEO,
          CONTENT_ITEM_VIDEO,
          CONTENT_ITEM_VIDEO,
          CONTENT_ITEM_VIDEO,
          CONTENT_ITEM_VIDEO,
        ],
        { next: null },
      );
      expect(result).toStrictEqual({
        data: [TILE_VIDEO, TILE_VIDEO, TILE_VIDEO, TILE_VIDEO, TILE_VIDEO],
        isLastPage: true,
      });
    });
  });
});
