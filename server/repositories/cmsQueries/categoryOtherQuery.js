const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');

class CategoryOtherQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
    'path',
  ];

  constructor(establishmentName, uuid, limit = 4, page = 1) {
    this.establishmentName = establishmentName;
    const queryWithoutOffset = new Query()
      .addFilter('field_moj_top_level_categories.id', uuid)
      .addFilter('field_not_in_series', 1)
      .addFields('node--page', CategoryOtherQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', CategoryOtherQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', CategoryOtherQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', CategoryOtherQuery.#TILE_FIELDS)
      .getQueryString();
    this.query = `${queryWithoutOffset}&${getPagination(page, limit)}`;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  transform(deserializedResponse, links) {
    if (deserializedResponse.length === 0) return null;
    return {
      contentType: 'default',
      isLastPage: !links.next,
      data: deserializedResponse.map(getSmallTile),
    };
  }
}

module.exports = { CategoryOtherQuery };
