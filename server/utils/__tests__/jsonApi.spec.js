const { getLargeTile, getSmallTile } = require('../jsonApi');

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
describe('getLargeTile', () => {
  describe('with complete data', () => {
    let result;
    beforeEach(() => {
      result = getLargeTile(imgData);
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
      expect(getLargeTile(null)).toBeNull();
    });
  });
  describe('with partial data', () => {
    it('should return only the image if provided', () => {
      expect(
        getLargeTile({ imageStyleUri: [{ tile_large: LARGE_TILE }] }),
      ).toEqual({ url: LARGE_TILE, alt: '' });
    });
    it('should return only the alt if provided', () => {
      expect(getLargeTile({ resourceIdObjMeta: { alt: ALT_TEXT } })).toEqual({
        url: '',
        alt: ALT_TEXT,
      });
    });
  });
});

describe('getSmallTile', () => {
  describe('with complete data', () => {
    let result;
    beforeEach(() => {
      result = getSmallTile(imgData);
    });
    it('should return the small image url', () => {
      expect(result.url).toEqual(SMALL_TILE);
    });
    it('should return the alt text', () => {
      expect(result.alt).toEqual(ALT_TEXT);
    });
  });
  describe('with no data', () => {
    it('should return null', () => {
      expect(getSmallTile(null)).toBeNull();
    });
  });
  describe('with partial data', () => {
    it('should return only the image if provided', () => {
      expect(
        getSmallTile({ imageStyleUri: [{ tile_small: SMALL_TILE }] }),
      ).toEqual({ url: SMALL_TILE, alt: '' });
    });
    it('should return only the alt if provided', () => {
      expect(getSmallTile({ resourceIdObjMeta: { alt: ALT_TEXT } })).toEqual({
        url: '',
        alt: ALT_TEXT,
      });
    });
  });
});
