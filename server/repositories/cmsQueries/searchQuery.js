const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class SearchQuery {
  constructor(establishmentName, searchTerm, limit) {
    this.establishmentName = establishmentName;
    this.query = new Query()
      .addFilter('fulltext', searchTerm)
      .addPageLimit(limit)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/index/content_for_search?${this.query}`;
  }

  transformEach(item) {
    return {
      title: item.title,
      summary: item.fieldMojDescription?.summary,
      url: `/content/${item.drupalInternal_Nid}`,
    };
  }
}

module.exports = { SearchQuery };
