/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class ExternalLinkPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()
      .addFields('node--external_link', [
        'title',
        'drupal_internal__nid',
        'field_external_url',
      ])
      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return {
      id: item.drupalInternal_Nid,
      title: item.title,
      url: item.fieldExternalUrl?.uri,
    };
  }
}

module.exports = { ExternalLinkPageQuery };
