/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile } = require('../../utils/jsonApi');

class SuggestionQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
    'path',
  ];

  constructor(
    establishmentName,
    categoryUUID,
    secondaryTagUUID,
    seriesUUID,
    limit = 4,
  ) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.query = new Query()
      .addFields('node--page', SuggestionQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', SuggestionQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', SuggestionQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', SuggestionQuery.#TILE_FIELDS)
      .addFields('file--file', ['image_style_uri'])
      .addInclude(['field_moj_thumbnail_image'])
      .addPageLimit(limit)
      .addSort('id', 'DESC');
    if (secondaryTagUUID.length > 0)
      query.addFilter(
        'field_moj_secondary_tags.id',
        secondaryTagUUID,
        'NOT IN',
      );
    if (seriesUUID)
      query.addFilter(
        'field_moj_series.meta.drupal_internal__tid',
        seriesUUID,
        '<>',
      );
    this.query = query.getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node/moj_radio_item/${this.uuid}/suggestions?${this.query}`;
  }

  transformEach(item) {
    return getSmallTile(item);
  }
}

module.exports = { SuggestionQuery };
