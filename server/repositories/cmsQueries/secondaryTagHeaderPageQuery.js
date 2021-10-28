/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getLargeTile } = require('../../utils/jsonApi');

class SecondaryTagHeaderPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()
      .addFields('taxonomy_term--tags', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_featured_image',
        'path',
      ])
      .addInclude(['field_featured_image'])
      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return getLargeTile(item);
  }
}

module.exports = { SecondaryTagHeaderPageQuery };
