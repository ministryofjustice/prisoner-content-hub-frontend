const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const {
  getPublishedAtSmallTile,
  getLargeTile,
  getPagination,
} = require('../../utils/jsonApi');

class HomepageUpdatesContentQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_thumbnail_image',
    'field_moj_description',
    'field_moj_series',
    'path',
    'type.meta.drupal_internal__target_id',
    'published_at',
  ];

  constructor(establishmentName, page, pageLimit) {
    this.establishmentName = establishmentName;
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

      .addGroup('categories_group', 'OR')

      .addFilter(
        'field_moj_top_level_categories.field_is_homepage_updates',
        true,
        '=',
        'categories_group',
      )
      .addFilter(
        'field_moj_series.field_is_homepage_updates',
        true,
        '=',
        'categories_group',
      )
      .getQueryString();

    this.query = `${queryWithoutOffset}&${getPagination(page, pageLimit)}`;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  transform(items, links) {
    return items.length
      ? {
          largeUpdateTileDefault: getLargeTile(items[0]),
          updatesContent: items.map(getPublishedAtSmallTile),
          isLastPage: !links.next,
        }
      : null;
  }
}

module.exports = { HomepageUpdatesContentQuery };
