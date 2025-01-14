const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class PrimaryNavigationQuery {
  constructor(establishmentName, language) {
    this.query = new Query()
      .addFields('menu_link_content--menu_link_content', ['id', 'title', 'url'])
      .getQueryString();
    this.establishmentName = establishmentName;
    this.language = language;
  }

  getKey() {
    return getCmsCacheKey(
      'primaryNavigation',
      this.language,
      this.establishmentName,
    );
  }

  getExpiry() {
    return 86400;
  }

  path() {
    return `/${this.language}/jsonapi/prison/${this.establishmentName}/primary_navigation?${this.query}`;
  }

  transformEach({ title: text, url: href }) {
    return {
      text,
      href,
    };
  }
}

module.exports = { PrimaryNavigationQuery };
