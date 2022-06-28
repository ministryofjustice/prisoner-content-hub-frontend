const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getLargeTile } = require('../../utils/jsonApi');

class HomepageContentQuery {
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

  constructor(establishmentName, pageLimit = 4) {
    this.establishmentName = establishmentName;
    this.query = new Query()

      .addFields(
        'node--field_featured_tiles',
        HomepageContentQuery.#TILE_FIELDS,
      )

      .addFields(
        'node--field_key_info_tiles',
        HomepageContentQuery.#TILE_FIELDS,
      )

      .addFields(
        'node--field_large_update_tile',
        HomepageContentQuery.#TILE_FIELDS,
      )

      .addFields('file--file', [
        'drupal_internal__fid',
        'id',
        'image_style_uri',
      ])

      .addInclude([
        'field_featured_tiles.field_moj_thumbnail_image',
        'field_featured_tiles',
        'field_large_update_tile',
        'field_key_info_tiles',
      ])

      .addPageLimit(pageLimit)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node/homepage?${this.query}`;
  }

  transformEach(item) {
    return {
      featuredContent: {
        data: item.fieldFeaturedTiles
          .filter(({ title = null, name = null }) => title || name)
          .map(getSmallTile),
      },
      keyInfo: {
        data: item.fieldKeyInfoTiles
          .filter(({ title = null, name = null }) => title || name)
          .map(getSmallTile),
      },
      largeUpdateTile: item?.fieldLargeUpdateTile
        ? getLargeTile(item.fieldLargeUpdateTile)
        : null,
    };
  }
}

module.exports = { HomepageContentQuery };
