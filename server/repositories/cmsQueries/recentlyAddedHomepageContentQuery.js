const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class RecentlyAddedHomepageContentQuery {
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

  constructor(establishmentName) {
    this.establishmentName = establishmentName;
    const queryWithoutOffset = new Query()
      .addFields('node--page', RecentlyAddedHomepageContentQuery.#TILE_FIELDS)
      .addFields(
        'node--moj_video_item',
        RecentlyAddedHomepageContentQuery.#TILE_FIELDS,
      )
      .addFields(
        'node--moj_radio_item',
        RecentlyAddedHomepageContentQuery.#TILE_FIELDS,
      )
      .addFields(
        'node--moj_pdf_item',
        RecentlyAddedHomepageContentQuery.#TILE_FIELDS,
      )

      .addFields('file--file', [
        'drupal_internal__fid',
        'id',
        'image_style_uri',
      ])

      .addInclude(['field_moj_thumbnail_image'])

      .addSort('published_at,created', 'DESC')

      .getQueryString();

    this.query = `${queryWithoutOffset}&${getPagination(1, 4)}`;
  }

  getKey() {
    return getCmsCacheKey(
      'recentlyAddedHomepageContent',
      this.establishmentName,
    );
  }

  getExpiry() {
    return 3600;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/recently-added?${this.query}`;
  }

  transform(deserializedResponse) {
    if (deserializedResponse.length === 0) return null;

    return {
      data: deserializedResponse.map(getSmallTile),
    };
  }
}

module.exports = { RecentlyAddedHomepageContentQuery };
