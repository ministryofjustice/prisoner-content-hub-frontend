/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getLargeImage, getSmallImage } = require('../../utils/jsonApi');

class HomepageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'field_moj_thumbnail_image',
    'field_image',
    'title',
    'field_moj_description',
    'field_moj_series',
  ];

  constructor(establishmentName) {
    this.establishmentName = establishmentName;
    this.query = new Query()

      .addFields('node--featured_articles', [
        'title',
        'drupal_internal__nid',
        'field_moj_featured_tile_large',
        'field_moj_featured_tile_small',
      ])
      .addFields('node--page', HomepageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', HomepageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', HomepageQuery.#TILE_FIELDS)
      .addFields('node--moj_pdf_item', HomepageQuery.#TILE_FIELDS)
      .addFields('node--landing_page', HomepageQuery.#TILE_FIELDS)
      .addFields('file--file', [
        'drupal_internal__fid',
        'id',
        'image_style_uri',
      ])

      .addInclude([
        'field_moj_featured_tile_large.field_moj_thumbnail_image',
        'field_moj_featured_tile_large.field_image',
        'field_moj_featured_tile_small.field_moj_thumbnail_image',
        'field_moj_featured_tile_small.field_image',
      ])
      .addPageLimit(1)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node/featured_articles?${this.query}`;
  }

  transformEach(item) {
    const [upperFeatured, lowerFeatured] = item.fieldMojFeaturedTileLarge.map(
      this.#asTile(getLargeImage),
    );
    const smallTiles = item.fieldMojFeaturedTileSmall.map(
      this.#asTile(getSmallImage),
    );

    return {
      upperFeatured,
      lowerFeatured,
      smallTiles,
    };
  }

  #asTile = getImage => item => ({
    id: item.drupalInternal_Nid,
    contentUrl: `/content/${item.drupalInternal_Nid}`,
    contentType: item.type.replace(/^node--/, ''),
    title: item.title,
    summary: item.fieldMojDescription?.summary,
    image: getImage(item.fieldMojThumbnailImage),
  });
}

module.exports = { HomepageQuery };
