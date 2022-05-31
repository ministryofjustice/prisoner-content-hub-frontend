const { renameKey } = require('../object');

describe('ObjectUtils', () => {
  describe('renameKey', () => {
    let data;

    beforeEach(() => {
      data = {
        contentType: 'topic',
        title: 'foo bar',
        summary: 'foo description',
        image: { alt: 'Foo Image', url: 'foo.url.com/image.png' },
        relatedContent: { contentType: 'foo', data: {} },
      };
    });

    it('should throw when a data object is not provided', () => {
      expect(() => {
        renameKey(null, 'currentKeyName', 'newKeyName');
      }).toThrow(/data, currentKeyName and newKeyName are all required/i);
    });

    it('should throw when a currentKeyName value is not provided', () => {
      expect(() => {
        renameKey(data, null, 'newKeyName');
      }).toThrow(/data, currentKeyName and newKeyName are all required/i);
    });

    it('should throw when a newKeyName value is not provided', () => {
      expect(() => {
        renameKey(data, 'currentKeyName', null);
      }).toThrow(/data, currentKeyName and newKeyName are all required/i);
    });

    it('should return a new object containing the expected structure and content types', () => {
      const newDataObject = renameKey(data, 'relatedContent', 'hubContent');

      expect(newDataObject).toEqual(
        expect.objectContaining({
          contentType: expect.any(String),
          title: expect.any(String),
          summary: expect.any(String),
          image: expect.objectContaining({
            alt: expect.any(String),
            url: expect.any(String),
          }),
          hubContent: expect.objectContaining({
            contentType: expect.any(String),
            data: expect.any(Object),
          }),
        }),
      );
    });

    it('should add a new key named hubContent and remove the relatedContent field', () => {
      const newDataObject = renameKey(data, 'relatedContent', 'hubContent');

      expect(newDataObject).toEqual({
        contentType: 'topic',
        title: 'foo bar',
        summary: 'foo description',
        image: {
          alt: 'Foo Image',
          url: 'foo.url.com/image.png',
        },
        hubContent: {
          contentType: 'foo',
          data: {},
        },
      });
    });
  });
});
