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

  #lookup = async (establishmentName, lookupType, id) => {
    const {
      jsonapi: { resourceName: type, individual: location },
      entity: { uuid },
    } = await this.jsonApiClient.getRelative(
      `/router/prison/${establishmentName}/translate-path?path=${lookupType}/${id}`,
    );
    return { type, location, uuid };
  };

  async lookupContent(establishmentName, contentId) {
    return this.#lookup(establishmentName, 'content', contentId);
  }

  async lookupTag(establishmentName, tagId) {
    return this.#lookup(establishmentName, 'tags', tagId);
  }

  async get(query) {
    const request = query.path
      ? this.jsonApiClient.getRelative(query.path())
      : this.jsonApiClient.getUrl(query.url());
    const response = await request;
    const deserializedResponse = dataFormatter.deserialize(response);
    return query.transformEach
      ? deserializedResponse.map(item => query.transformEach(item))
      : query.transform(deserializedResponse);
  }
}

module.exports = { CmsApi };
