/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class LinkPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()
      .addFields('node--link', [
        'title',
        'drupal_internal__nid',
        'field_show_interstitial_page',
        'field_url',
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
      url: item.fieldUrl,
      intercept: item.fieldShowInterstitialPage === true,
    };
  }
}

module.exports = { LinkPageQuery };
