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

  async get(query) {
    const response = await this.jsonApiClient.get(query.path());
    const items = dataFormatter.deserialize(response);
    return items.map(item => query.transform(item));
  }
}

module.exports = { CmsApi };
