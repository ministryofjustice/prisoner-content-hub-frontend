const { typeFrom } = require('../adapters');

describe('Adapters', () => {
  describe('.typeFrom', () => {
    it('should return the correct type for an audio item', () => {
      expect(typeFrom('moj_radio_item')).toBe('radio');
    });
    it('should return the correct type for an video item', () => {
      expect(typeFrom('moj_video_item')).toBe('video');
    });
    it('should strip "node--" from the type string', () => {
      expect(typeFrom('node--moj_video_item')).toBe('video');
    });
    it('should return the correct type for an pdf item', () => {
      expect(typeFrom('moj_pdf_item')).toBe('pdf');
    });

    it('should return the correct type for a landing page item', () => {
      expect(typeFrom('landing_page')).toBe('landing-page');
    });

    it('should return the correct type for a page', () => {
      expect(typeFrom('page')).toBe('page');
    });

    it('should return the correct type for a series', () => {
      expect(typeFrom('series')).toBe('series');
    });

    it('should return the correct type for a series', () => {
      expect(typeFrom('tags')).toBe('tags');
    });
  });
});
