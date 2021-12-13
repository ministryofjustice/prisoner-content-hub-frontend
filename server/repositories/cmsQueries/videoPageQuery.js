const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const {
  getLargeImage,
  getCategoryIds,
  buildSecondaryTags,
} = require('../../utils/jsonApi');

class VideoPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()

      .addFields('node--moj_video_item', [
        'drupal_internal__nid',
        'title',
        'field_video',
        'field_moj_description',
        'field_moj_secondary_tags',
        'field_moj_series',
        'field_moj_season',
        'field_moj_episode',
        'field_moj_top_level_categories',
        'field_moj_thumbnail_image',
        'series_sort_value',
        'field_exclude_feedback',
      ])

      .addFields('file--file', ['uri', 'image_style_uri'])
      .addFields('taxonomy_term--series', [
        'drupal_internal__tid',
        'name',
        'path',
      ])
      .addFields('taxonomy_term--tags', [
        'drupal_internal__tid',
        'name',
        'path',
      ])
      .addFields('taxonomy_term--moj_categories', [
        'drupal_internal__tid',
        'name',
      ])
      .addInclude([
        'field_moj_thumbnail_image',
        'field_moj_subtitles',
        'field_moj_series',
        'field_video',
        'field_moj_secondary_tags',
        'field_moj_top_level_categories',
      ])

      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return {
      id: item.drupalInternal_Nid,
      uuid: item.id,
      title: item.title,
      contentType: 'video',
      description: item.fieldMojDescription?.processed,
      episodeId:
        item.fieldMojSeason !== undefined && item.fieldMojEpisode !== undefined
          ? item.fieldMojSeason * 1000 + item.fieldMojEpisode
          : item.fieldMojEpisode,
      seasonId: item.fieldMojSeason,
      seriesId: item.fieldMojSeries?.drupalInternal_Tid,
      seriesPath: item.fieldMojSeries?.path?.alias,
      seriesName: item.fieldMojSeries?.name,
      seriesSortValue: item.seriesSortValue,
      media: item.fieldVideo?.uri?.url,
      categories: getCategoryIds(item.fieldMojTopLevelCategories),
      secondaryTags: buildSecondaryTags(item.fieldMojSecondaryTags),
      image: getLargeImage(item.fieldMojThumbnailImage),
      excludeFeedback: item.fieldExcludeFeedback,
      subtitles: item.fieldMojSubtitles?.uri?.value,
    };
  }
}

module.exports = { VideoPageQuery };
