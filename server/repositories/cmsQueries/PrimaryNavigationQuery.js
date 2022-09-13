const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class PrimaryNavigationQuery {
  constructor(establishmentName) {
    this.query = new Query()
      .addFields('menu_link_content--menu_link_content', ['id', 'title', 'url'])
      .getQueryString();
    this.establishmentName = establishmentName;
  }

  getKey() {
    getCmsCacheKey('primaryNavigation', this.establishmentName);
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/primary_navigation?${this.query}`;
  }

  transformEach({ title: text, url: href }) {
    return {
      text,
      href,
    };
  }
}

module.exports = { PrimaryNavigationQuery };
