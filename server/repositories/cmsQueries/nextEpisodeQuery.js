const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class NextEpisodeQuery {
  static #EPISODE_FIELDS = [
    'drupal_internal__nid',
    'field_moj_episode',
    'title',
    'field_moj_season',
    'field_moj_series',
    'series_sort_value',
    'field_moj_thumbnail_image',
  ];

  constructor(establishmentName, seriesId, seriesSortValue) {
    this.establishmentName = establishmentName;
    this.query = new Query()

      .addFields('node--page', NextEpisodeQuery.#EPISODE_FIELDS)
      .addFields('node--moj_video_item', NextEpisodeQuery.#EPISODE_FIELDS)
      .addFields('node--moj_radio_item', NextEpisodeQuery.#EPISODE_FIELDS)
      .addFields('node--moj_pdf_item', NextEpisodeQuery.#EPISODE_FIELDS)
      .addFields('node--landing_page', NextEpisodeQuery.#EPISODE_FIELDS)
      .addFields('file--file', ['uri', 'image_style_uri'])

      .addFilter('field_moj_series.meta.drupal_internal__tid', seriesId)
      .addFilter('series_sort_value', seriesSortValue, '>')

      .addSort('series_sort_value')

      .addInclude(['field_moj_thumbnail_image'])

      .addPageLimit(3)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  transformEach(item) {
    return {
      id: item.drupalInternal_Nid,
      episodeId:
        item.fieldMojSeason !== undefined && item.fieldMojEpisode !== undefined
          ? item.fieldMojSeason * 1000 + item.fieldMojEpisode
          : item.fieldMojEpisode,
      title: item.title,
      seasonId: item.fieldMojSeason,
      seriesSortValue: item.seriesSortValue,
      image: {
        url: item.fieldMojThumbnailImage?.uri?.url,
        alt: item.fieldMojThumbnailImage?.resourceIdObjMeta?.alt,
      },
    };
  }
}

module.exports = { NextEpisodeQuery };
