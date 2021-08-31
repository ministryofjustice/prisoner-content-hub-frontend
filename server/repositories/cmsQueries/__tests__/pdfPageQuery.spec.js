const { PdfPageQuery } = require('../pdfPageQuery');

describe('PDF page query', () => {
  const query = new PdfPageQuery('https://cms/content/1234');
  describe('url', () => {
    it('should create correct path', async () => {
      expect(query.url()).toStrictEqual(
        'https://cms/content/1234?include=field_moj_pdf&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_pdf',
      );
    });
  });

  describe('transform', () => {
    it('should create correct basic page structure', async () => {
      const pdfPage = {
        drupalInternal_Nid: 5923,
        title: 'JD Williams',
        type: 'node--node--pdf',
        fieldMojPdf: {
          uri: { url: 'https://cms.org/2021-03/JD%20WILLIAMS%20PDF.pdf' },
        },
      };

      expect(query.transform(pdfPage)).toStrictEqual({
        id: 5923,
        title: 'JD Williams',
        contentType: 'pdf',
        url: 'https://cms.org/2021-03/JD%20WILLIAMS%20PDF.pdf',
      });
    });
  });
});
