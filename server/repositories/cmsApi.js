/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { Jsona, SwitchCaseJsonMapper } = require('jsona');

const dataFormatter = new Jsona({
  jsonPropertiesMapper: new SwitchCaseJsonMapper({
    camelizeAttributes: true,
    camelizeRelationships: true,
    camelizeType: false,
    camelizeMeta: true,
    switchChar: '_  ',
  }),
});

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
  .addSort('name')
  .addPageLimit(100)
  .getQueryString();

class CmsApi {
  constructor(jsonApiClient) {
    this.jsonApiClient = jsonApiClient;
  }

  async getTopics(establishmentName) {
    const response = await this.jsonApiClient.get(
      `/jsonapi/prison/${establishmentName}/taxonomy_term?${topicsQuery}`,
    );

    const items = dataFormatter.deserialize(response);
    return this.transform(items);
  }

  asTag({ drupalInternal_Tid: id, name, description }) {
    return {
      id,
      linkText: name,
      description: description?.processed,
      href: `/tags/${id}`,
    };
  }

  asCategory({ name, description, fieldLegacyLandingPage }) {
    const id =
      fieldLegacyLandingPage?.resourceIdObjMeta?.drupal_internal__target_id;
    return {
      id,
      linkText: name,
      description: description?.processed,
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
