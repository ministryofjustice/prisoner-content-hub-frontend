const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class TopicsQuery {
  static #QUERYSTRING = new Query()
    .addFields('taxonomy_term--tags', ['drupal_internal__tid', 'name'])
    .addFilter('vid.meta.drupal_internal__target_id', 'tags')
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

  transformEach({ drupalInternal_Tid: id, name }) {
    return {
      id,
      linkText: name,
      href: `/tags/${id}`,
    };
  }
}

module.exports = { TopicsQuery };
