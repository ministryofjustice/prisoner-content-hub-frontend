const { Jsona, SwitchCaseJsonMapper } = require('jsona');
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const config = require('../config');

const dataFormatter = new Jsona({
  jsonPropertiesMapper: new SwitchCaseJsonMapper({
    camelizeAttributes: true,
    camelizeRelationships: true,
    camelizeType: false,
    camelizeMeta: true,
    switchChar: '_',
  }),
});

function searchRepository(jsonApiClient) {
  async function find({ query, limit = 15, prison }) {
    const searchQuery = new Query()
      .addFilter('fulltext', query)
      .addPageLimit(limit)
      .getQueryString();
    const response = await jsonApiClient.get(
      `/jsonapi/prison/${prison}/index/content_for_search?${searchQuery}`,
    );

    const items = dataFormatter.deserialize(response);
    return transform(items);
  }

  async function typeAhead({ query, limit = 5, prison }) {
    const searchQuery = new Query()
      .addFilter('fulltext', query)
      .addPageLimit(limit)
      .getQueryString();
    const response = await jsonApiClient.get(
      `/jsonapi/prison/${prison}/index/content_for_search?${searchQuery}`,
    );

    const items = dataFormatter.deserialize(response);
    return transform(items);
  }

  function transform(items) {
    return items.map(item => ({
      title: item.title,
      summary: item.fieldMojDescription?.summary,
      url: `/content/${item.drupalInternal_Nid}`,
    }));
  }
  return {
    find,
    typeAhead,
  };
}

module.exports = {
  searchRepository,
};
