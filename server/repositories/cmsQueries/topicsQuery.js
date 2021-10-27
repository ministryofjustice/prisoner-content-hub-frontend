/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class TopicsQuery {
  static #TOPIC_FIELDS = ['drupal_internal__tid', 'name', 'description'];

  static #QUERYSTRING = new Query()
    .addFields('taxonomy_term--tags', TopicsQuery.#TOPIC_FIELDS)
    .addFields('taxonomy_term--moj_categories', TopicsQuery.#TOPIC_FIELDS)
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

  transformEach({ drupalInternal_Tid: id, name, description }) {
    return {
      id,
      linkText: name,
      description: description?.processed,
      href: `/tags/${id}`,
    };
  }
}

module.exports = { TopicsQuery };
