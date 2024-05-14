const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class CategoryCollectionsQuery {
  static #TILE_FIELDS = [
    'type',
    'drupal_internal__tid',
    'name',
    'field_moj_thumbnail_image',
    'path',
    'content_updated',
    'child_term_count',
    'published_at',
  ];

  constructor(establishmentName, uuid, limit = 10, page = 1) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.limit = limit;
    this.page = page;
    const queryWithoutOffset = new Query()
      .addFields('taxonomy_term--series', CategoryCollectionsQuery.#TILE_FIELDS)
      .addFields(
        'taxonomy_term--moj_categories',
        CategoryCollectionsQuery.#TILE_FIELDS,
      )
      .addInclude(['field_moj_thumbnail_image'])
      .getQueryString();
    this.query = `${queryWithoutOffset}&${getPagination(page, limit)}`;
  }

  getKey() {
    return getCmsCacheKey(
      'categoryCollections',
      this.establishmentName,
      this.uuid,
      `limit:${this.limit}`,
      `page:${this.page}`,
    );
  }

  getExpiry() {
    return 3600;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term/moj_categories/${this.uuid}/sub_terms?${this.query}`;
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
