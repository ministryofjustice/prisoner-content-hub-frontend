const { CategoryPageQuery } = require('../categoryPageQuery');

describe('Category collection query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const UUID = `42`;
  const query = new CategoryPageQuery(ESTABLISHMENTNAME, UUID);
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/taxonomy_term/moj_categories/${UUID}?include=field_featured_tiles%2Cfield_featured_tiles.field_moj_thumbnail_image&fields%5Bnode--page%5D=drupal_internal__nid%2Cdrupal_internal__tid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cfield_exclude_feedback&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Cdrupal_internal__tid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cfield_exclude_feedback&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Cdrupal_internal__tid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cfield_exclude_feedback&fields%5Bmoj_pdf_item%5D=drupal_internal__nid%2Cdrupal_internal__tid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cfield_exclude_feedback&fields%5Btaxonomy_term_series%5D=drupal_internal__nid%2Cdrupal_internal__tid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cfield_exclude_feedback&fields%5Btaxonomy_term--moj_categories%5D=name%2Cdescription%2Cfield_exclude_feedback%2Cfield_featured_tiles%2Cbreadcrumbs%2Cchild_term_count`,
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
    const COLLECTION_ITEM_CATEGORY = {
      id: 101,
      type: 'taxonomy_term--moj_categories',
      drupalInternal_Tid: `1001`,
      name: `name`,
      description: { processed: `description` },
      fieldExcludeFeedback: true,
      fieldMojThumbnailImage: {
        imageStyleUri: [{ tile_small: `tile_small` }],
        resourceIdObjMeta: { alt: `alt` },
      },
      path: { alias: `/tags/101` },
      childTermCount: {
        sub_categories_count: 0,
        sub_series_count: 1,
      },
    };
    const COLLECTION_ITEM_SERIES = {
      id: 101,
      type: 'taxonomy_term--series',
      drupalInternal_Tid: `1001`,
      name: `name`,
      description: { processed: `description` },
      fieldExcludeFeedback: true,
      fieldMojThumbnailImage: {
        imageStyleUri: [{ tile_small: `tile_small` }],
        resourceIdObjMeta: { alt: `alt` },
      },
      path: { alias: `/tags/101` },
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
      displayUrl: undefined,
      externalContent: false,
    };
    const TILE_CATEGORY = {
      contentType: 'category',
      contentUrl: '/tags/101',
      displayUrl: undefined,
      externalContent: false,
      id: '1001',
      image: {
        alt: 'alt',
        url: 'tile_small',
      },
      summary: 'description',
      title: 'name',
    };
    const TILE_SERIES = {
      contentType: 'series',
      contentUrl: '/tags/101',
      displayUrl: undefined,
      externalContent: false,
      id: '1001',
      image: {
        alt: 'alt',
        url: 'tile_small',
      },
      summary: 'description',
      title: 'name',
    };
    let rawData;
    let result;
    const breadcrumbProcessed = [
      { href: 'bread01/url', text: 'bread01' },
      { href: 'bread02/url', text: 'bread02' },
      { href: 'bread03/url', text: 'bread03' },
      { href: '', text: 'Category' },
    ];

    beforeEach(() => {
      rawData = {
        name: 'Category',
        breadcrumbs: [
          { uri: 'bread01/url', title: 'bread01' },
          { uri: 'bread02/url', title: 'bread02' },
          { uri: 'bread03/url', title: 'bread03' },
        ],
        description: { processed: 'A description' },
        fieldExcludeFeedback: false,
        path: {
          alias: 'path/path',
        },
        fieldFeaturedTiles: [
          CONTENT_ITEM_VIDEO,
          COLLECTION_ITEM_CATEGORY,
          COLLECTION_ITEM_SERIES,
          COLLECTION_ITEM_CATEGORY,
          CONTENT_ITEM_VIDEO,
        ],
      };
      result = query.transform(rawData);
    });

    it('should return an array of featured tiles', () => {
      expect(result.categoryFeaturedContent).toStrictEqual([
        TILE_VIDEO,
        TILE_CATEGORY,
        TILE_SERIES,
        TILE_CATEGORY,
        TILE_VIDEO,
      ]);
    });
    it('should return an array of breadcrumbs', () => {
      expect(result.breadcrumbs).toStrictEqual(breadcrumbProcessed);
    });
    it('should return the category details', () => {
      expect(result).toEqual(
        expect.objectContaining({
          title: rawData.name,
          contentType: 'category',
          description: rawData.description.processed,
          excludeFeedback: rawData.fieldExcludeFeedback,
          config: {
            content: true,
            header: false,
            postscript: true,
            returnUrl: rawData.path.alias,
          },
        }),
      );
    });
  });
});
