const {
  getLargeImage,
  getLargeTile,
  getSmallTile,
  getCategoryIds,
  buildSecondaryTags,
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
          image: { url: 'tile_large', alt: 'alt' },
        });
      });
    });
  });
  describe('with tag tile data', () => {
    const tileData = {
      drupalInternal_Tid: 42,
      type: 'taxonomy_term--series',
      name: 'title',
      description: { processed: 'summary' },
      fieldFeaturedImage: {
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
        expect(getSmallTile(tileData)).toEqual({
          id: 42,
          contentType: 'series',
          title: 'title',
          summary: 'summary',
          contentUrl: '/tags/42',
          image: { url: 'tile_small', alt: 'alt' },
        });
      });
    });
    describe('getLargeTile', () => {
      const result = getLargeTile(tileData);
      it('should return the large tile data', () => {
        expect(result).toEqual({
          id: 42,
          contentType: 'series',
          title: 'title',
          summary: 'summary',
          contentUrl: '/tags/42',
          image: { url: 'tile_large', alt: 'alt' },
        });
      });
    });
  });
});

describe('getCategoryIds', () => {
  const ID1 = '42';
  const UUID1 = '418';
  const ID2 = '101';
  const UUID2 = '404';
  const categoryData = [
    { resourceIdObjMeta: { drupal_internal__target_id: ID1 }, id: UUID1 },
    { resourceIdObjMeta: { drupal_internal__target_id: ID2 }, id: UUID2 },
    { resourceIdObjMeta: { drupal_internal__target_id: ID1 }, id: UUID2 },
    { resourceIdObjMeta: { drupal_internal__target_id: ID2 }, id: UUID1 },
  ];
  const result = getCategoryIds(categoryData);
  it('should return the category ids', () => {
    expect(result).toEqual([
      { id: ID1, uuid: UUID1 },
      { id: ID2, uuid: UUID2 },
      { id: ID1, uuid: UUID2 },
      { id: ID2, uuid: UUID1 },
    ]);
  });
});

describe('buildSecondaryTags', () => {
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
  const result = buildSecondaryTags(categoryData);
  it('should return the category ids', () => {
    expect(result).toEqual([
      { id: ID1, uuid: UUID1, name: NAME1 },
      { id: ID2, uuid: UUID2, name: NAME2 },
      { id: ID1, uuid: UUID2, name: NAME1 },
    ]);
  });
});
