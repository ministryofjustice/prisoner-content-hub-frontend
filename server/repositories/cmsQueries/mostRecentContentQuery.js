const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');
const { getOffsetUnixTime } = require('../../utils/date');

class MostRecentContentQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_thumbnail_image',
    'field_thumbnail_image',
    'field_moj_description',
    'field_moj_series',
    'path',
  ];

  constructor(establishmentName, page, pageLimit) {
    const timeStamp = getOffsetUnixTime(14);

    this.establishmentName = establishmentName;
    const queryWithoutOffset = new Query()
      .addFields('node--page', MostRecentContentQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', MostRecentContentQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', MostRecentContentQuery.#TILE_FIELDS)
      .addFields('node--moj_pdf_item', MostRecentContentQuery.#TILE_FIELDS)

      .addFields('file--file', [
        'drupal_internal__fid',
        'id',
        'image_style_uri',
      ])

      // .addFilter('type', ['node--page', 'node--moj_video_item', 'node--moj_radio_item', 'node--moj_pdf_item'], 'IN')

      .addFilter('created', timeStamp, '>=')

      .addSort('published_at,created', 'DESC')

      .getQueryString();

    this.query = `${queryWithoutOffset}&${getPagination(page, pageLimit)}`;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  transform(deserializedResponse, links) {
    if (deserializedResponse.length === 0) return null;

    return {
      isLastPage: !links.next,
      data: deserializedResponse
        .filter(({ type }) =>
          [
            'node--page',
            'node--moj_video_item',
            'node--moj_radio_item',
            'node--moj_pdf_item',
          ].includes(type),
        )
        .map(getSmallTile),
    };
  }
}

module.exports = { MostRecentContentQuery };
