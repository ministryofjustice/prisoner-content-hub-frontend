/* eslint-disable class-methods-use-this */
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
        'field_featured_image',
      ])
      .addInclude(['field_featured_image'])
      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return {
      id: item?.drupalInternal_Tid,
      contentType: 'series',
      name: item?.name,
      description: item?.description?.processed,
      image: getLargeTile(item?.fieldFeaturedImage),
    };
  }
}

module.exports = { SeriesHeaderPageQuery };
