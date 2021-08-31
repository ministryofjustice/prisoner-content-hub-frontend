/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

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

      .addInclude([
        'field_moj_thumbnail_image',
        'field_moj_series',
        'field_video',
        'field_moj_secondary_tags',
      ])

      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  #flattenDrupalInternalTargetId = arr =>
    arr.flatMap(
      ({ resourceIdObjMeta: { drupal_internal__target_id: id } }) => id,
    );

  #buildSecondaryTags = arr =>
    arr.map(({ drupalInternal_Tid: id, name }) => ({
      id,
      name,
    }));

  transform(item) {
    const url =
      item.fieldMojThumbnailImage?.imageStyleUri
        ?.map(image => image?.tile_large)
        .find(image => Boolean(image)) || item.fieldMojThumbnailImage?.uri?.url;

    return {
      id: item.drupalInternal_Nid,
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
      media: item.fieldVideo?.uri?.url,
      categories: this.#flattenDrupalInternalTargetId(
        item.fieldMojTopLevelCategories,
      ),
      secondaryTags: this.#buildSecondaryTags(item.fieldMojSecondaryTags),
      image: {
        url,
        alt: item.fieldMojThumbnailImage?.resourceIdObjMeta?.alt,
      },
    };
  }
}

module.exports = { VideoPageQuery };
