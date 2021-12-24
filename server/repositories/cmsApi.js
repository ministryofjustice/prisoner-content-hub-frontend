const { Jsona, SwitchCaseJsonMapper } = require('jsona');
const { NotFound } = require('./apiError');

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

  #lookup = async (establishmentName, lookupType, id) =>
    // Router will return 403 when content exists but not assigned to this prison
    this.#throwNotFoundWhenStatusIs([403, 404], async () => {
      const data = await this.jsonApiClient.getRelative(
        `/router/prison/${establishmentName}/translate-path?path=${lookupType}/${id}`,
      );
      const {
        jsonapi: { resourceName: type, individual: location },
        entity: { uuid },
      } = data;
      return { type, location, uuid };
    });

  async lookupContent(establishmentName, contentId) {
    return this.#lookup(establishmentName, 'content', contentId);
  }

  async lookupTag(establishmentName, tagId) {
    return this.#lookup(establishmentName, 'tags', tagId);
  }

  async lookupExternalLink(establishmentName, tagId) {
    return this.#lookup(establishmentName, 'external-link', tagId);
  }

  async get(query) {
    return this.#throwNotFoundWhenStatusIs([404], async () => {
      const request = query.path
        ? this.jsonApiClient.getRelative(query.path())
        : this.jsonApiClient.getUrl(query.url());
      const response = await request;
      const deserializedResponse = dataFormatter.deserialize(response);
      return query.transformEach
        ? deserializedResponse.map(item => query.transformEach(item))
        : query.transform(deserializedResponse, response.links);
    });
  }

  #throwNotFoundWhenStatusIs = async (statusCodes, call) => {
    try {
      return await call();
    } catch (err) {
      if (statusCodes.includes(err?.response?.status)) {
        throw new NotFound(err.request.path);
      }
      throw err;
    }
  };
}

module.exports = { CmsApi };
