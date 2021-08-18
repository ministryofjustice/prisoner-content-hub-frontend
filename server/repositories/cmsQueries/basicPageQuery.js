/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

// will need tests
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

  transform(item) {
    return {
      id: item.drupalInternal_Nid,
      title: item.title,
      contentType: item.type.replace(/^node--/, ''),
      description: item.fieldMojDescription.processed,
      standFirst: item.fieldMojStandFirst,
      categories: this.#flattenDrupalInternalTargetId(
        item.fieldMojTopLevelCategories,
      ),
      secondaryTags: this.#flattenDrupalInternalTargetId(
        item.fieldMojSecondaryTags,
      ),
    };
  }
}

module.exports = { BasicPageQuery };
