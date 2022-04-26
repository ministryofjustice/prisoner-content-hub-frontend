const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getLargeTile } = require('../../utils/jsonApi');

class TopicHeaderPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()
      .addFields('taxonomy_term--topics', [
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

module.exports = { TopicHeaderPageQuery };