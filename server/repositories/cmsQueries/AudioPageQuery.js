/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class AudioPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()

      .addFields('node--moj_radio_item', [
        'drupal_internal__nid',
        'title',
        'field_moj_audio',
        'field_moj_description',
        'field_moj_secondary_tags',
        'field_moj_series',
        'field_moj_season',
        'field_moj_episode',
        'field_moj_top_level_categories',
        'field_moj_thumbnail_image',
        'field_moj_programme_code',
      ])

      .addFields('file--file', ['uri'])
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
        'field_moj_audio',
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
    return {
      id: item.drupalInternal_Nid,
      title: item.title,
      contentType: 'radio',
      description: item.fieldMojDescription?.processed,
      programmeCode: item.fieldMojProgrammeCode,
      episodeId:
        item.fieldMojSeason !== undefined && item.fieldMojEpisode !== undefined
          ? item.fieldMojSeason * 1000 + item.fieldMojEpisode
          : item.fieldMojEpisode,
      seasonId: item.fieldMojSeason,
      seriesId: item.fieldMojSeries[0]?.drupalInternal_Tid,
      seriesPath: item.fieldMojSeries[0]?.path?.alias,
      seriesName: item.fieldMojSeries[0]?.name,
      media: item.fieldMojAudio?.uri?.url,
      categories: this.#flattenDrupalInternalTargetId(
        item.fieldMojTopLevelCategories,
      ),
      secondaryTags: this.#buildSecondaryTags(item.fieldMojSecondaryTags),
      image: {
        url: item.fieldMojThumbnailImage?.uri?.url,
        alt: item.fieldMojThumbnailImage?.resourceIdObjMeta?.alt,
      },
    };
  }
}

module.exports = { AudioPageQuery };
