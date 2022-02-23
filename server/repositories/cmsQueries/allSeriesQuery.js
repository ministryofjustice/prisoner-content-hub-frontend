const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');

class AllSeriesQuery {
  static #TILE_FIELDS = [
    'drupal_internal__tid',
    'name',
    'field_featured_image',
    'path',
  ];

  constructor(establishmentName, uuid, limit = 10, page = 1) {
    this.establishmentName = establishmentName;
    const queryWithoutOffset = new Query()
      .addFilter('field_category.id', uuid)
      .addFields('taxonomy_term--series', AllSeriesQuery.#TILE_FIELDS)
      .addInclude(['field_featured_image'])
      .addSort('name', 'ASC')
      .getQueryString();
    this.query = `${queryWithoutOffset}&${getPagination(page, limit)}`;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term?${this.query}`;
  }

  transform(deserializedResponse, links) {
    if (deserializedResponse.length === 0) return null;
    return {
      contentType: 'series',
      isLastPage: !links.next,
      data: deserializedResponse.map(getSmallTile),
    };
  }
}

module.exports = { AllSeriesQuery };
