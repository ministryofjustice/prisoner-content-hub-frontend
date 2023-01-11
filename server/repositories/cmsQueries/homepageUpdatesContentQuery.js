const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getCmsCacheKey } = require('../../utils/caching/cms');
const {
  getPublishedAtSmallTile,
  getLargeTile,
  getPagination,
} = require('../../utils/jsonApi');
const { getOffsetUnixTime } = require('../../utils/date');

class HomepageUpdatesContentQuery {
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

  constructor(establishmentName, page, pageLimit) {
    this.establishmentName = establishmentName;
    this.page = page;
    this.limit = pageLimit;
    const queryWithoutOffset = new Query()
      .addFields('node--page', HomepageUpdatesContentQuery.#TILE_FIELDS)
      .addFields(
        'node--moj_video_item',
        HomepageUpdatesContentQuery.#TILE_FIELDS,
      )
      .addFields(
        'node--moj_radio_item',
        HomepageUpdatesContentQuery.#TILE_FIELDS,
      )
      .addFields('node--moj_pdf_item', HomepageUpdatesContentQuery.#TILE_FIELDS)

      .addFields('file--file', [
        'drupal_internal__fid',
        'id',
        'image_style_uri',
      ])

      .addInclude(['field_moj_thumbnail_image'])

      .addGroup('parent_or_group', 'OR')
      .addGroup('categories_group', 'AND', 'parent_or_group')
      .addGroup('series_group', 'AND', 'parent_or_group')

      .addFilter(
        'field_moj_top_level_categories.field_is_homepage_updates',
        1,
        '=',
        'categories_group',
      )
      .addFilter(
        'published_at',
        getOffsetUnixTime(90),
        '>=',
        'categories_group',
      )
      .addFilter(
        'field_moj_series.field_is_homepage_updates',
        1,
        '=',
        'series_group',
      )
      .addFilter('published_at', getOffsetUnixTime(90), '>=', 'series_group')
      .addSort('published_at,created', 'DESC')
      .getQueryString();

    this.query = `${queryWithoutOffset}&${getPagination(page, pageLimit)}`;
  }

  getKey() {
    return getCmsCacheKey(
      'homepageUpdates',
      this.establishmentName,
      `limit:${this.limit}`,
      `page:${this.page}`,
    );
  }

  getExpiry() {
    return 300;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  transform(items, links) {
    return items?.length
      ? {
          largeUpdateTileDefault: getLargeTile(items[0]),
          updatesContent: items.map(getPublishedAtSmallTile),
          isLastPage: !links.next,
        }
      : { largeUpdateTileDefault: null, updatesContent: [], isLastPage: true };
  }
}

module.exports = { HomepageUpdatesContentQuery };
