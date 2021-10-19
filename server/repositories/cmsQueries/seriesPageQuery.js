/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getLargeImage, getSmallTile } = require('../../utils/jsonApi');

class SeriesPageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
    'field_moj_series',
  ];

  constructor(establishmentName, uuid) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.query = new Query()
      .addFilter('field_moj_series.id', uuid)
      .addFields('node--page', SeriesPageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', SeriesPageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', SeriesPageQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', SeriesPageQuery.#TILE_FIELDS)
      .addFields('file--file', ['image_style_uri'])
      .addFields('taxonomy_term--series', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_featured_image',
      ])
      .addInclude([
        'field_moj_thumbnail_image',
        'field_moj_series.field_featured_image',
      ])
      .addSort('series_sort_value', 'ASC')
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  #getSeries = item => ({
    id: item?.drupalInternal_Tid,
    contentType: 'series',
    name: item?.name,
    description: item?.description?.processed,
    image: getLargeImage(item?.fieldFeaturedImage),
  });

  transform(deserializedResponse) {
    if (deserializedResponse.length === 0) return null;
    return {
      ...this.#getSeries(deserializedResponse[0].fieldMojSeries),
      ...{
        relatedContent: {
          contentType: 'default',
          data: deserializedResponse.map(item => getSmallTile(item)),
        },
      },
    };
  }
}

module.exports = { SeriesPageQuery };
