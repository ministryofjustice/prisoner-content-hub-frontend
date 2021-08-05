/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

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
      .addFields('file--file', ['drupal_internal__fid', 'id', 'uri'])

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

  transform(item) {
    const [upperFeatured, lowerFeatured] = item.fieldMojFeaturedTileLarge.map(
      this.#asTile,
    );
    const smallTiles = item.fieldMojFeaturedTileSmall.map(this.#asTile);

    return {
      upperFeatured,
      lowerFeatured,
      smallTiles,
    };
  }

  #asTile = item => ({
    id: item.drupalInternal_Nid,
    contentUrl: `/content/${item.drupalInternal_Nid}`,
    contentType: item.type.replace(/^node--/, ''),
    isSeries: Boolean(item.fieldMojSeries),
    title: item.title,
    summary: item.fieldMojDescription?.summary,
    image: {
      url: item.fieldMojThumbnailImage?.uri?.url,
      alt: item.fieldMojThumbnailImage?.resourceIdObjMeta?.alt,
    },
  });
}

module.exports = { HomepageQuery };
