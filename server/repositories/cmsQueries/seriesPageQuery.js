const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const {
  getLargeTile,
  getSmallTile,
  getPagination,
  mapBreadcrumbs,
} = require('../../utils/jsonApi');

class SeriesPageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
    'field_moj_series',
    'path',
  ];

  constructor(establishmentName, uuid, page) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    const queryWithoutOffset = new Query()
      .addFilter('field_moj_series.id', uuid)
      .addFields('node--page', SeriesPageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', SeriesPageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', SeriesPageQuery.#TILE_FIELDS)
      .addFields('node--moj_pdf_item', SeriesPageQuery.#TILE_FIELDS)
      .addFields('file--file', ['image_style_uri'])
      .addFields('taxonomy_term--series', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_moj_thumbnail_image',
        'path',
        'field_exclude_feedback',
        'breadcrumbs',
      ])
      .addInclude([
        'field_moj_thumbnail_image',
        'field_moj_series.field_moj_thumbnail_image',
      ])
      .addSort('series_sort_value,created', 'ASC')
      .getQueryString();
    this.query = `${queryWithoutOffset}&${getPagination(page)}`;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  transform(deserializedResponse, links) {
    if (deserializedResponse.length === 0) return null;
    const series = deserializedResponse[0].fieldMojSeries;
    return {
      excludeFeedback: series.fieldExcludeFeedback,
      ...getLargeTile(series),
      breadcrumbs: mapBreadcrumbs(series?.breadcrumbs, series.name),
      ...{
        hubContentData: {
          contentType: 'series',
          isLastPage: !links.next,
          data: deserializedResponse.map(getSmallTile),
        },
      },
    };
  }
}

module.exports = { SeriesPageQuery };
