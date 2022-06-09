const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile } = require('../../utils/jsonApi');

class ExploreContentQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_thumbnail_image',
    'field_thumbnail_image',
    'field_moj_description',
    'field_moj_series',
    'path',
    'type.meta.drupal_internal__target_id',
  ];

  constructor(establishmentName, pageLimit = 4) {
    this.establishmentName = establishmentName;
    this.query = new Query()
      .addFields('node--page', ExploreContentQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', ExploreContentQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', ExploreContentQuery.#TILE_FIELDS)
      .addFields('node--moj_pdf_item', ExploreContentQuery.#TILE_FIELDS)

      .addInclude(['field_moj_thumbnail_image'])

      .addPageLimit(pageLimit)

      .getQueryString();
  }

  path() {
    return `/jsonapi/explore/node?${this.query}`;
  }

  transform(deserializedResponse, links) {
    if (deserializedResponse.length === 0) return null;

    return {
      isLastPage: !links.next,
      data: deserializedResponse.map(getSmallTile),
    };
  }
}

module.exports = { ExploreContentQuery };
