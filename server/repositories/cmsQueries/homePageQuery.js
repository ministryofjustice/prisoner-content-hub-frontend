const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getLargeTile, getSmallTile } = require('../../utils/jsonApi');

class HomepageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_thumbnail_image',
    'field_thumbnail_image',
    'field_moj_description',
    'field_moj_series',
    'path',
  ];

  constructor(establishmentName) {
    this.establishmentName = establishmentName;
    this.query = new Query()

      .addFields('node--featured_articles', [
        'title',
        'drupal_internal__nid',
        'field_featured_tile_large',
        'field_featured_tile_small',
      ])
      .addFields('node--page', HomepageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', HomepageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', HomepageQuery.#TILE_FIELDS)
      .addFields('node--moj_pdf_item', HomepageQuery.#TILE_FIELDS)
      .addFields('taxonomy_term--series', [
        'drupal_internal__tid',
        'name',
        'description',
        'path',
        'field_featured_image',
      ])

      .addFields('file--file', [
        'drupal_internal__fid',
        'id',
        'image_style_uri',
      ])

      .addInclude([
        'field_featured_tile_large.field_moj_thumbnail_image',
        'field_featured_tile_small.field_moj_thumbnail_image',
        'field_featured_tile_large.field_featured_image',
        'field_featured_tile_small.field_featured_image',
      ])
      .addPageLimit(1)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node/featured_articles?${this.query}`;
  }

  transformEach(item) {
    const [upperFeatured, lowerFeatured] = item.fieldFeaturedTileLarge.map(
      featured => (featured?.path?.alias ? getLargeTile(featured) : null),
    );
    return {
      upperFeatured,
      lowerFeatured,
      smallTiles: item.fieldFeaturedTileSmall
        .filter(({ title = null, name = null }) => title || name)
        .map(getSmallTile),
    };
  }
}

module.exports = { HomepageQuery };
