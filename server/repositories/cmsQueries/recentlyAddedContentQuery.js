const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');

class RecentlyAddedContentQuery {
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

  constructor(establishmentName, page, pageLimit, timeStamp) {
    this.establishmentName = establishmentName;
    const queryWithoutOffset = new Query()
      .addFields('node--page', RecentlyAddedContentQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', RecentlyAddedContentQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', RecentlyAddedContentQuery.#TILE_FIELDS)
      .addFields('node--moj_pdf_item', RecentlyAddedContentQuery.#TILE_FIELDS)

      .addFields('file--file', [
        'drupal_internal__fid',
        'id',
        'image_style_uri',
      ])

      .addInclude(['field_moj_thumbnail_image'])

      .addFilter(
        'type.meta.drupal_internal__target_id',
        ['page', 'moj_video_item', 'moj_radio_item', 'moj_pdf_item'],
        'IN',
      )

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
      data: deserializedResponse.map(getSmallTile),
    };
  }
}

module.exports = { RecentlyAddedContentQuery };