const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile } = require('../../utils/jsonApi');

class HomepageContentQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_thumbnail_image',
    'field_moj_description',
    'field_moj_series',
    'path',
    'type.meta.drupal_internal__target_id',
  ];

  constructor(establishmentName, pageLimit = 4) {
    this.establishmentName = establishmentName;
    this.query = new Query()

      .addFields(
        'node--field_featured_tiles',
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
      ])

      .addPageLimit(pageLimit)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node/homepage?${this.query}`;
  }

  transformEach(item) {
    const homepageContent = {
      featuredContent: {
        data: item.fieldFeaturedTiles.map(getSmallTile),
      },
    };
    return homepageContent;
  }
}

module.exports = { HomepageContentQuery };
