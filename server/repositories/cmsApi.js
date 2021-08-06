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

  async lookupContent(establishmentName, contentId) {
    const {
      jsonapi: { resourceName, individual },
    } = await this.jsonApiClient.getRelative(
      `/router/prison/${establishmentName}/translate-path?path=content/${contentId}`,
    );

    return {
      type: resourceName,
      location: individual,
    };
  }

  async get(query) {
    const request = query.path
      ? this.jsonApiClient.getRelative(query.path())
      : this.jsonApiClient.getUrl(query.url());
    const response = await request;
    const deserializedResponse = dataFormatter.deserialize(response);
    if (Array.isArray(deserializedResponse)) {
      return deserializedResponse.map(item => query.transform(item));
    }
    return query.transform(deserializedResponse);
  }

  // this will need tests
  async getSingle(query) {
    const response = await this.jsonApiClient.get(query.path());
    const item = dataFormatter.deserialize(response);
    return query.transform(item);
  }
}

module.exports = { CmsApi };
