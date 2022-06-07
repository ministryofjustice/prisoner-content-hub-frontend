const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getLargeTile } = require('../../utils/jsonApi');

class SeriesHeaderPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()
      .addFields('taxonomy_term--series', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_moj_thumbnail_image',
        'path',
      ])
      .addInclude(['field_moj_thumbnail_image'])
      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return getLargeTile(item);
  }
}

module.exports = { SeriesHeaderPageQuery };
