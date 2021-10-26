/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class InThisSectionQuery {
  constructor(establishmentName, uuid) {
    this.establishmentName = establishmentName;
    this.query = new Query()
      .addFilter('field_category.id', uuid)
      .addFields('taxonomy_term--series', ['drupal_internal__tid', 'name'])
      .addSort('name', 'ASC')
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term?${this.query}`;
  }

  transformEach({ name: linkText, drupalInternal_Tid: id }) {
    return { linkText, href: `/tags/${id}` };
  }
}

module.exports = { InThisSectionQuery };
