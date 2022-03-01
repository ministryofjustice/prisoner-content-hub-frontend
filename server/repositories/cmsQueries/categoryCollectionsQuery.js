const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');

class CategoryCollectionsQuery {
  static #TILE_FIELDS = [
    'type',
    'drupal_internal__tid',
    'name',
    'field_featured_image',
    'path',
    'content_updated',
    'child_term_count',
  ];

  constructor(establishmentName, uuid, limit = 10, page = 1) {
    this.establishmentName = establishmentName;
    const queryWithoutOffset = new Query()
      .addFields('taxonomy_term--series', CategoryCollectionsQuery.#TILE_FIELDS)
      .addFields(
        'taxonomy_term--moj_categories',
        CategoryCollectionsQuery.#TILE_FIELDS,
      )
      .addGroup('series_sub_categories', 'OR')
      .addFilter('parent.id', uuid, '=', 'series_sub_categories')
      .addFilter('field_category.id', uuid, '=', 'series_sub_categories')
      .addInclude(['field_featured_image'])
      .addSort('content_updated,drupal_internal__tid', 'DESC')
      .getQueryString();
    this.query = `${queryWithoutOffset}&${getPagination(page, limit)}`;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term?${this.query}`;
  }

  transform(deserializedResponse, links) {
    if (deserializedResponse.length === 0) return null;
    return {
      isLastPage: !links.next,
      data: deserializedResponse.map(getSmallTile),
    };
  }
}

module.exports = { CategoryCollectionsQuery };
