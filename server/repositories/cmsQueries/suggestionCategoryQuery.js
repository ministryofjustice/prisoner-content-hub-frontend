/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile } = require('../../utils/jsonApi');

class SuggestionCategoryQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
  ];

  constructor(establishmentName, uuid, limit = 4) {
    this.establishmentName = establishmentName;
    this.query = new Query()
      .addFilter('field_moj_top_level_categories.id', uuid, 'IN')
      .addFields('node--page', SuggestionCategoryQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', SuggestionCategoryQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', SuggestionCategoryQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', SuggestionCategoryQuery.#TILE_FIELDS)
      .addInclude(['field_moj_thumbnail_image'])
      .addPageLimit(limit)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  transformEach(item) {
    return getSmallTile(item);
  }
}

module.exports = { SuggestionCategoryQuery };
