/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile } = require('../../utils/jsonApi');

class SuggestionQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
  ];

  constructor(establishmentName, uuid, limit = 4) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.query = new Query()
      // .addFilter('field_moj_top_level_categories.id', categoryUUID, 'IN')
      .addFields('node--page', SuggestionQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', SuggestionQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', SuggestionQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', SuggestionQuery.#TILE_FIELDS)
      .addFields('file--file', ['image_style_uri'])
      .addInclude(['field_moj_thumbnail_image'])
      .addPageLimit(limit)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node/moj_radio_item/${this.uuid}/suggestions?${this.query}`;
  }

  transformEach(item) {
    return getSmallTile(item);
  }
}

module.exports = { SuggestionQuery };
