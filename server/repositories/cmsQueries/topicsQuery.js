const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class TopicsQuery {
  static #QUERYSTRING = new Query()
    .addFields('taxonomy_term--topics', ['drupal_internal__tid', 'name'])
    .addFilter('vid.meta.drupal_internal__target_id', 'topics')
    .addSort('name')
    .addPageLimit(100)
    .getQueryString();

  constructor(establishmentName, language) {
    this.establishmentName = establishmentName;
    this.language = language;
  }

  getKey() {
    return getCmsCacheKey(this.language, 'topics', this.establishmentName);
  }

  getExpiry() {
    return 86400;
  }

  path() {
    return `/${this.language}/jsonapi/prison/${this.establishmentName}/taxonomy_term?${TopicsQuery.#QUERYSTRING}`;
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
