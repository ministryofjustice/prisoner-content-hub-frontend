/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class TopicsQuery {
  static #QUERYSTRING = new Query()
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

  constructor(establishmentName) {
    this.establishmentName = establishmentName;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term?${
      TopicsQuery.#QUERYSTRING
    }`;
  }

  transformEach(item) {
    const isTag = item.type === 'taxonomy_term--tags';
    return isTag ? this.#asTag(item) : this.#asCategory(item);
  }

  #asTag = ({ drupalInternal_Tid: id, name, description }) => ({
    id,
    linkText: name,
    description: description?.processed,
    href: `/tags/${id}`,
  });

  #asCategory = ({ name, description, fieldLegacyLandingPage }) => {
    const id =
      fieldLegacyLandingPage?.resourceIdObjMeta?.drupal_internal__target_id;
    return {
      id,
      linkText: name,
      description: description?.processed,
      href: `/content/${id}`,
    };
  };
}

module.exports = { TopicsQuery };
