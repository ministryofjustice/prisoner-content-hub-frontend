const {
  getPagination,
  getLargeImage,
  getLargeTile,
  getSmallTile,
  getCategoryId,
  buildFieldTopics,
  typeFrom,
  isBottomCategory,
} = require('../jsonApi');

const LARGE_TILE = 'enormous.jpg';
const SMALL_TILE = 'tiny.png';
const ALT_TEXT = 'alt text';

let imgData;
beforeEach(() => {
  imgData = {
    imageStyleUri: [
      {
        tile_large: LARGE_TILE,
        tile_small: SMALL_TILE,
      },
    ],
    resourceIdObjMeta: {
      alt: ALT_TEXT,
    },
  };
});
describe('getLargeImage', () => {
  describe('with complete data', () => {
    let result;
    beforeEach(() => {
      result = getLargeImage(imgData);
    });
    it('should return the large image url', () => {
      expect(result.url).toEqual(LARGE_TILE);
    });
    it('should return the alt text', () => {
      expect(result.alt).toEqual(ALT_TEXT);
    });
  });
  describe('with no data', () => {
    it('should return null', () => {
      expect(getLargeImage(null)).toBeNull();
    });
  });
  describe('with partial data', () => {
    it('should return only the image if provided', () => {
      expect(
        getLargeImage({ imageStyleUri: [{ tile_large: LARGE_TILE }] }),
      ).toEqual({ url: LARGE_TILE, alt: '' });
    });
    it('should return only the alt if provided', () => {
      expect(getLargeImage({ resourceIdObjMeta: { alt: ALT_TEXT } })).toEqual({
        url: '',
        alt: ALT_TEXT,
      });
    });
  });
});

describe('getting tile data', () => {
  describe('with content tile data', () => {
    const tileData = {
      drupalInternal_Nid: 42,
      type: 'moj_video_item',
      title: 'title',
      fieldDisplayUrl: 'link',
      fieldMojDescription: { summary: 'summary' },
      fieldMojThumbnailImage: {
        imageStyleUri: [
          {
            tile_small: 'tile_small',
            tile_large: 'tile_large',
          },
        ],
        resourceIdObjMeta: { alt: 'alt' },
      },
      path: { alias: '/content/42' },
    };
    describe('getSmallTile', () => {
      it('should return the small tile data', () => {
        expect(getSmallTile(tileData)).toEqual({
          id: 42,
          contentType: 'video',
          title: 'title',
          summary: 'summary',
          contentUrl: '/content/42',
          displayUrl: 'link',
          externalContent: false,
          image: { url: 'tile_small', alt: 'alt' },
        });
      });

      it('PDF website content type opens in a new tab', () => {
        expect(getSmallTile({ ...tileData, type: 'moj_pdf_item' })).toEqual({
          id: 42,
          contentType: 'pdf',
          title: 'title',
          summary: 'summary',
          contentUrl: '/content/42',
          displayUrl: 'link',
          externalContent: true,
          image: { url: 'tile_small', alt: 'alt' },
        });
      });

      it('External website content type', () => {
        expect(
          getSmallTile({
            ...tileData,
            type: 'link',
            fieldShowInterstitialPage: true,
          }),
        ).toEqual({
          id: 42,
          contentType: 'external_link',
          title: 'title',
          summary: 'summary',
          contentUrl: '/content/42',
          displayUrl: 'link',
          externalContent: true,
          image: { url: 'tile_small', alt: 'alt' },
        });
      });

      it('Internal website content type', () => {
        expect(
          getSmallTile({
            ...tileData,
            type: 'link',
            fieldShowInterstitialPage: false,
          }),
        ).toEqual({
          id: 42,
          contentType: 'internal_link',
          title: 'title',
          summary: 'summary',
          contentUrl: '/content/42',
          displayUrl: 'link',
          externalContent: false,
          image: { url: 'tile_small', alt: 'alt' },
        });
      });
    });
    describe('getLargeTile', () => {
      const result = getLargeTile(tileData);
      it('should return the large tile data', () => {
        expect(result).toEqual({
          id: 42,
          contentType: 'video',
          title: 'title',
          summary: 'summary',
          contentUrl: '/content/42',
          displayUrl: 'link',
          externalContent: false,
          image: { url: 'tile_large', alt: 'alt' },
        });
      });

      it('PDF website content type opens in a new tab', () => {
        expect(getLargeTile({ ...tileData, type: 'moj_pdf_item' })).toEqual({
          id: 42,
          contentType: 'pdf',
          title: 'title',
          summary: 'summary',
          contentUrl: '/content/42',
          displayUrl: 'link',
          externalContent: true,
          image: { url: 'tile_large', alt: 'alt' },
        });
      });

      it('External website content type', () => {
        expect(
          getLargeTile({
            ...tileData,
            type: 'link',
            fieldShowInterstitialPage: true,
          }),
        ).toEqual({
          id: 42,
          contentType: 'external_link',
          title: 'title',
          summary: 'summary',
          contentUrl: '/content/42',
          displayUrl: 'link',
          externalContent: true,
          image: { url: 'tile_large', alt: 'alt' },
        });
      });

      it('Internal website content type', () => {
        expect(
          getLargeTile({
            ...tileData,
            type: 'link',
            fieldShowInterstitialPage: false,
          }),
        ).toEqual({
          id: 42,
          contentType: 'internal_link',
          title: 'title',
          summary: 'summary',
          contentUrl: '/content/42',
          displayUrl: 'link',
          externalContent: false,
          image: { url: 'tile_large', alt: 'alt' },
        });
      });
    });
  });
  describe('with series tag tile data', () => {
    const seriesTileData = {
      drupalInternal_Tid: 42,
      type: 'taxonomy_term--series',
      name: 'title',
      description: { processed: 'summary' },
      fieldMojThumbnailImage: {
        imageStyleUri: [
          {
            tile_small: 'tile_small',
            tile_large: 'tile_large',
          },
        ],
        resourceIdObjMeta: { alt: 'alt' },
      },
      path: { alias: '/tags/42' },
    };
    describe('getSmallTile', () => {
      it('should return the small tile data', () => {
        expect(getSmallTile(seriesTileData)).toEqual({
          id: 42,
          contentType: 'series',
          title: 'title',
          summary: 'summary',
          contentUrl: '/tags/42',
          externalContent: false,
          image: { url: 'tile_small', alt: 'alt' },
        });
      });
    });
    describe('getLargeTile', () => {
      const result = getLargeTile(seriesTileData);
      it('should return the large tile data', () => {
        expect(result).toEqual({
          id: 42,
          contentType: 'series',
          title: 'title',
          summary: 'summary',
          contentUrl: '/tags/42',
          externalContent: false,
          image: { url: 'tile_large', alt: 'alt' },
        });
      });
    });
  });
  describe('with category tag tile data', () => {
    const categoryTileData = {
      drupalInternal_Tid: 42,
      type: 'taxonomy_term--moj_categories',
      name: 'title',
      description: { processed: 'summary' },
      fieldMojThumbnailImage: {
        imageStyleUri: [
          {
            tile_small: 'tile_small',
            tile_large: 'tile_large',
          },
        ],
        resourceIdObjMeta: { alt: 'alt' },
      },
      path: { alias: '/tags/42' },
      childTermCount: {
        sub_categories_count: 1,
        sub_series_count: 0,
      },
    };
    describe('getSmallTile', () => {
      it('should return the small tile for a category', () => {
        expect(getSmallTile(categoryTileData)).toEqual({
          id: 42,
          contentType: 'category',
          title: 'title',
          summary: 'summary',
          contentUrl: '/tags/42',
          externalContent: false,
          image: { url: 'tile_small', alt: 'alt' },
        });
      });
      it('should return the small tile data for a bottom category', () => {
        const bottomCategoryTileData = {
          ...categoryTileData,
          childTermCount: {
            sub_categories_count: 0,
            sub_series_count: 0,
          },
        };
        expect(getSmallTile(bottomCategoryTileData)).toEqual({
          id: 42,
          contentType: 'category_bottom',
          title: 'title',
          summary: 'summary',
          contentUrl: '/tags/42',
          externalContent: false,
          image: { url: 'tile_small', alt: 'alt' },
        });
      });
    });
  });
});

describe('getCategoryId', () => {
  const ID1 = '42';
  const UUID1 = '418';
  const categoryData = {
    resourceIdObjMeta: { drupal_internal__target_id: ID1 },
    id: UUID1,
  };
  const result = getCategoryId(categoryData);
  it('should return the category ids', () => {
    expect(result).toEqual({ id: ID1, uuid: UUID1 });
  });
  it('should cater for legacy receiving an array and return the category id from the first element', () => {
    expect(getCategoryId([categoryData])).toEqual({ id: ID1, uuid: UUID1 });
  });
});

describe('buildFieldTopics', () => {
  const ID1 = '42';
  const UUID1 = '418';
  const NAME1 = 'Chip';
  const ID2 = '101';
  const UUID2 = '404';
  const NAME2 = 'Del';
  const categoryData = [
    { drupalInternal_Tid: ID1, id: UUID1, name: NAME1 },
    { drupalInternal_Tid: ID2, id: UUID2, name: NAME2 },
    { drupalInternal_Tid: ID1, id: UUID2, name: NAME1 },
  ];
  const result = buildFieldTopics(categoryData);
  it('should return the category ids', () => {
    expect(result).toEqual([
      { id: ID1, uuid: UUID1, name: NAME1 },
      { id: ID2, uuid: UUID2, name: NAME2 },
      { id: ID1, uuid: UUID2, name: NAME1 },
    ]);
  });
});

describe('typeFrom', () => {
  it('should return the correct type for an audio item', () => {
    expect(typeFrom({ type: 'moj_radio_item' })).toStrictEqual({
      contentType: 'radio',
      externalContent: false,
    });
  });
  it('should return the correct type for an video item', () => {
    expect(typeFrom({ type: 'moj_video_item' })).toStrictEqual({
      contentType: 'video',
      externalContent: false,
    });
  });
  it('should strip "node--" from the type string', () => {
    expect(typeFrom({ type: 'node--moj_video_item' })).toStrictEqual({
      contentType: 'video',
      externalContent: false,
    });
  });
  it('should return the correct type for an pdf item', () => {
    expect(typeFrom({ type: 'moj_pdf_item' })).toStrictEqual({
      contentType: 'pdf',
      externalContent: true,
    });
  });

  it('should return the correct type for a page', () => {
    expect(typeFrom({ type: 'page' })).toStrictEqual({
      contentType: 'page',
      externalContent: false,
    });
  });

  it('should return the correct type for a series', () => {
    expect(typeFrom({ type: 'series' })).toStrictEqual({
      contentType: 'series',
      externalContent: false,
    });
  });

  it('should return the correct type for a topic', () => {
    expect(typeFrom({ type: 'topics' })).toStrictEqual({
      contentType: 'topic',
      externalContent: false,
    });
  });
});

describe('isBottomCategory', () => {
  it('should return true, if no sub categories', () => {
    expect(
      isBottomCategory({
        sub_categories_count: 0,
        sub_series_count: 0,
      }),
    ).toBeTruthy();
  });
  it('should not update the type, if is category with sub categories', () => {
    expect(
      isBottomCategory({
        sub_categories_count: 1,
        sub_series_count: 0,
      }),
    ).toBeFalsy();
  });
  it('should not update the type, if is category with series', () => {
    expect(
      isBottomCategory({
        sub_categories_count: 0,
        sub_series_count: 1,
      }),
    ).toBeFalsy();
  });
});

describe('with content tile data', () => {
  const tileData = {
    drupalInternal_Nid: 42,
    type: 'moj_video_item',
    title: 'title',
    fieldDisplayUrl: 'link',
    fieldMojDescription: { summary: 'summary' },
    fieldMojThumbnailImage: {
      imageStyleUri: [
        {
          tile_small: 'tile_small',
          tile_large: 'tile_large',
        },
      ],
      resourceIdObjMeta: { alt: 'alt' },
    },
    path: { alias: '/content/42' },
  };
  describe('getSmallTile', () => {
    it('should return the small tile data', () => {
      expect(getSmallTile(tileData)).toEqual({
        id: 42,
        contentType: 'video',
        title: 'title',
        summary: 'summary',
        contentUrl: '/content/42',
        displayUrl: 'link',
        externalContent: false,
        image: { url: 'tile_small', alt: 'alt' },
      });
    });

    it('PDF website content type opens in a new tab', () => {
      expect(getSmallTile({ ...tileData, type: 'moj_pdf_item' })).toEqual({
        id: 42,
        contentType: 'pdf',
        title: 'title',
        summary: 'summary',
        contentUrl: '/content/42',
        displayUrl: 'link',
        externalContent: true,
        image: { url: 'tile_small', alt: 'alt' },
      });
    });

    it('Internal website content type', () => {
      expect(
        getSmallTile({
          ...tileData,
          type: 'link',
          fieldShowInterstitialPage: false,
        }),
      ).toEqual({
        id: 42,
        contentType: 'internal_link',
        title: 'title',
        summary: 'summary',
        contentUrl: '/content/42',
        displayUrl: 'link',
        externalContent: false,
        image: { url: 'tile_small', alt: 'alt' },
      });
    });

    it('External website content type', () => {
      expect(
        getSmallTile({
          ...tileData,
          type: 'link',
          fieldShowInterstitialPage: true,
        }),
      ).toEqual({
        id: 42,
        contentType: 'external_link',
        title: 'title',
        summary: 'summary',
        contentUrl: '/content/42',
        displayUrl: 'link',
        externalContent: true,
        image: { url: 'tile_small', alt: 'alt' },
      });
    });
  });

  describe('getPagination', () => {
    it('should return the correct pagination for page zero', () => {
      expect(getPagination(0)).toEqual('page[offset]=0&page[limit]=40');
    });

    it('should return the correct pagination for page one', () => {
      expect(getPagination(1)).toEqual('page[offset]=0&page[limit]=40');
    });

    it('should return the correct pagination for page two', () => {
      expect(getPagination(2)).toEqual('page[offset]=40&page[limit]=40');
    });

    it('should return the correct pagination for page three', () => {
      expect(getPagination(3)).toEqual('page[offset]=80&page[limit]=40');
    });
  });
});
