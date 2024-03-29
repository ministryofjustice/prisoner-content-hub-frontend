const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const {
  mapBreadcrumbs,
  getCategoryId,
  buildFieldTopics,
} = require('../../utils/jsonApi');

class BasicPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()

      .addFields('node--page', [
        'drupal_internal__nid',
        'title',
        'created',
        'field_main_body_content',
        'field_moj_stand_first',
        'field_topics',
        'field_moj_series',
        'field_moj_top_level_categories',
        'field_exclude_feedback',
        'breadcrumbs',
      ])
      .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
      .addFields('taxonomy_term--moj_categories', [
        'drupal_internal__tid',
        'name',
      ])
      .addInclude(['field_topics', 'field_moj_top_level_categories'])

      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return {
      id: item.drupalInternal_Nid,
      title: item.title,
      created: item.created,
      contentType: 'page',
      breadcrumbs: mapBreadcrumbs(item.breadcrumbs, item.title),
      description: item.fieldMainBodyContent?.processed,
      standFirst: item.fieldMojStandFirst,
      categories: getCategoryId(item.fieldMojTopLevelCategories),
      topics: buildFieldTopics(item.fieldTopics),
      excludeFeedback: item.fieldExcludeFeedback,
    };
  }
}

module.exports = { BasicPageQuery };
