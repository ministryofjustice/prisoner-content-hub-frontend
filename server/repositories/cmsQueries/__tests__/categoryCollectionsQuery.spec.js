const { getPagination } = require('../../../utils/jsonApi');
const { CategoryCollectionsQuery } = require('../categoryCollectionsQuery');

describe('Category collection query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const UUID = `42`;
  const LIMIT = 17;
  const PAGE = 2;
  const query = new CategoryCollectionsQuery(
    ESTABLISHMENTNAME,
    UUID,
    LIMIT,
    PAGE,
  );
  describe('path', () => {
    it('should create correct path', () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/taxonomy_term?filter%5Bseries_sub_categories%5D%5Bgroup%5D%5Bconjunction%5D=OR&filter%5Bparent.id%5D%5Bcondition%5D%5Bpath%5D=parent.id&filter%5Bparent.id%5D%5Bcondition%5D%5Bvalue%5D=${UUID}&filter%5Bparent.id%5D%5Bcondition%5D%5BmemberOf%5D=series_sub_categories&filter%5Bfield_category.id%5D%5Bcondition%5D%5Bpath%5D=field_category.id&filter%5Bfield_category.id%5D%5Bcondition%5D%5Bvalue%5D=${UUID}&filter%5Bfield_category.id%5D%5Bcondition%5D%5BmemberOf%5D=series_sub_categories&include=field_featured_image&sort=-content_updated%2Cdrupal_internal__tid&fields%5Btaxonomy_term--series%5D=type%2Cdrupal_internal__tid%2Cname%2Cfield_featured_image%2Cpath%2Ccontent_updated%2Cchild_term_count&fields%5Btaxonomy_term--moj_categories%5D=type%2Cdrupal_internal__tid%2Cname%2Cfield_featured_image%2Cpath%2Ccontent_updated%2Cchild_term_count&${getPagination(
          PAGE,
          LIMIT,
        )}`,
      );
    });
  });

  describe('transform', () => {
    const COLLECTION_ITEM_CATEGORY = {
      id: 101,
      type: 'taxonomy_term--moj_categories',
      drupalInternal_Tid: `1001`,
      name: `name`,
      description: { processed: `description` },
      fieldExcludeFeedback: true,
      fieldFeaturedImage: {
        imageStyleUri: [{ tile_small: `tile_small` }],
        resourceIdObjMeta: { alt: `alt` },
      },
      path: { alias: `/tags/101` },
      childTermCount: {
        sub_categories_count: 1,
        sub_series_count: 0,
      },
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
    const COLLECTION_ITEM_SERIES = {
      id: 101,
      type: 'taxonomy_term--series',
      drupalInternal_Tid: `1001`,
      name: `name`,
      description: { processed: `description` },
      fieldExcludeFeedback: true,
      fieldFeaturedImage: {
        imageStyleUri: [{ tile_small: `tile_small` }],
        resourceIdObjMeta: { alt: `alt` },
      },
      path: { alias: `/tags/101` },
    };
    it('should return null if the Array is empty', () => {
      expect(query.transform([])).toBeNull();
    });

    it('should return an array of small tiles and identify further pages', () => {
      const result = query.transform(
        [
          COLLECTION_ITEM_CATEGORY,
          COLLECTION_ITEM_CATEGORY,
          COLLECTION_ITEM_SERIES,
          COLLECTION_ITEM_CATEGORY,
        ],
        { next: 'NextPageURL' },
      );
      expect(result).toStrictEqual({
        data: [TILE_CATEGORY, TILE_CATEGORY, TILE_SERIES, TILE_CATEGORY],
        isLastPage: false,
      });
    });
    it('should return an array of small tiles and identify a last page', () => {
      const result = query.transform(
        [
          COLLECTION_ITEM_SERIES,
          COLLECTION_ITEM_CATEGORY,
          COLLECTION_ITEM_SERIES,
        ],
        { next: null },
      );
      expect(result).toStrictEqual({
        data: [TILE_SERIES, TILE_CATEGORY, TILE_SERIES],
        isLastPage: true,
      });
    });
  });
});