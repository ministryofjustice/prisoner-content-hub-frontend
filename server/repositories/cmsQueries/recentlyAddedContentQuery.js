const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class RecentlyAddedContentQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_thumbnail_image',
    'field_summary',
    'field_moj_series',
    'path',
    'type.meta.drupal_internal__target_id',
    'published_at',
  ];

  constructor(establishmentName, page, pageLimit, timeStamp, language) {
    this.establishmentName = establishmentName;
    this.page = page;
    this.limit = pageLimit;
    this.language = language;

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

  getKey() {
    return getCmsCacheKey(
      'recentlyAddedContent',
      this.establishmentName,
      `limit:${this.limit}`,
      `page:${this.page}`,
      this.language,
    );
  }

  getExpiry() {
    return 300;
  }

  path() {
    return `/${this.language}/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
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
