/* eslint-disable class-methods-use-this */
const { Jsona, SwitchCaseJsonMapper } = require('jsona');

const dataFormatter = new Jsona({
  jsonPropertiesMapper: new SwitchCaseJsonMapper({
    camelizeAttributes: true,
    camelizeRelationships: true,
    camelizeType: false,
    camelizeMeta: true,
    switchChar: '_',
  }),
});
class CmsApi {
  constructor(jsonApiClient) {
    this.jsonApiClient = jsonApiClient;
  }

  async lookupContent(contentId) {
    // this will need to use config to get host name
    const response = await this.jsonApiClient.get(
      `https://drupal.justice.gov.uk/router/translate-path?path=content/${contentId}`,
    );
    return {
      type: response.jsonapi.resourceName,
      location: response.jsonapi.individual,
    };
  }

  async get(query) {
    const response = await this.jsonApiClient.get(query.path());
    const items = dataFormatter.deserialize(response);
    return items.map(item => query.transform(item));
  }

  // this will need tests
  async getSingle(query) {
    const response = await this.jsonApiClient.get(query.path());
    const item = dataFormatter.deserialize(response);
    return query.transform(item);
  }
}

module.exports = { CmsApi };
