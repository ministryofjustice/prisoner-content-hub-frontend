const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class BasicPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()

      .addFields('node--page', [
        'drupal_internal__nid',
        'title',
        'field_moj_description',
        'field_moj_stand_first',
        'field_moj_secondary_tags',
        'field_moj_series',
        'field_moj_top_level_categories',
        'field_exclude_feedback',
      ])
      .addFields('taxonomy_term--tags', ['drupal_internal__tid', 'name'])
      .addFields('taxonomy_term--moj_categories', [
        'drupal_internal__tid',
        'name',
      ])
      .addInclude([
        'field_moj_secondary_tags',
        'field_moj_top_level_categories',
      ])

      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  #flattenDrupalInternalTargetId = arr =>
    arr.map(
      ({ resourceIdObjMeta: { drupal_internal__target_id: id }, name }) => ({
        id,
        name,
      }),
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
      contentType: 'page',
      description: item.fieldMojDescription.processed,
      standFirst: item.fieldMojStandFirst,
      categories: this.#flattenDrupalInternalTargetId(
        item.fieldMojTopLevelCategories,
      ),
      secondaryTags: this.#buildSecondaryTags(item.fieldMojSecondaryTags),
      excludeFeedback: item.fieldExcludeFeedback,
    };
  }
}

module.exports = { BasicPageQuery };
