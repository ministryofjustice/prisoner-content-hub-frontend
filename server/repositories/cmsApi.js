/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

const topicsQuery = new Query()
  .addFields('taxonomy_term--tags', [
    'drupal_internal__tid',
    'name',
    'description',
  ])
  .addFields('taxonomy_term--moj_categories', [
    'name',
    'description',
    'field_legacy_landing_page',
  ])
  .addFilter(
    'vid.meta.drupal_internal__target_id',
    ['moj_categories', 'tags'],
    'IN',
  )
  .addPageLimit(100)
  .getQueryString();

class CmsApi {
  constructor(jsonApiClient) {
    this.jsonApiClient = jsonApiClient;
  }

  async getTopics(establishmentName) {
    if (!establishmentName) {
      return [];
    }

    const { data } = await this.jsonApiClient.get(
      `/jsonapi/prison/${establishmentName}/taxonomy_term?${topicsQuery}`,
    );

    return this.transform(data || []);
  }

  asTag({ attributes }) {
    const id = attributes.drupal_internal__tid;
    return {
      id,
      linkText: attributes.name,
      description: attributes?.description?.processed,
      href: `/tags/${id}`,
    };
  }

  asCategory({ attributes, relationships }) {
    const id =
      relationships?.field_legacy_landing_page?.data?.meta
        ?.drupal_internal__target_id;
    return {
      id,
      linkText: attributes.name,
      description: attributes?.description?.processed,
      href: `/content/${id}`,
    };
  }

  transform(items) {
    return items.map(item => {
      const isTag = item.type === 'taxonomy_term--tags';
      return isTag ? this.asTag(item) : this.asCategory(item);
    });
  }
}

module.exports = { CmsApi, topicsQuery };
