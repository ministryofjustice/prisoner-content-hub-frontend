/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class PdfPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()

      .addFields('node--moj_pdf_item', [
        'drupal_internal__nid',
        'title',
        'field_moj_pdf',
      ])

      .addInclude(['field_moj_pdf'])

      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return {
      id: item.drupalInternal_Nid,
      title: item.title,
      contentType: 'pdf',
      url: item.fieldMojPdf?.uri?.url,
    };
  }
}

module.exports = { PdfPageQuery };
