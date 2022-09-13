const { clone } = require('ramda');
const { Jsona, SwitchCaseJsonMapper } = require('jsona');
const { NotFound } = require('./apiError');
const { InMemoryCachingStrategy } = require('../utils/caching/memory');
const { getCmsCacheKey } = require('../utils/caching/cms');

const dataFormatter = new Jsona({
  jsonPropertiesMapper: new SwitchCaseJsonMapper({
    camelizeAttributes: true,
    camelizeRelationships: true,
    camelizeType: false,
    camelizeMeta: true,
    switchChar: '_',
  }),
});

const CMS_ROUTER = 'router';

class CmsApi {
  #cache;

  constructor({ jsonApiClient, cachingStrategy }) {
    this.jsonApiClient = jsonApiClient;
    this.#cache = cachingStrategy || new InMemoryCachingStrategy();
  }

  #lookup = async (establishmentName, lookupType, id) => {
    const cacheKey = getCmsCacheKey(
      CMS_ROUTER,
      establishmentName,
      lookupType,
      id,
    );
    const cacheValue = (await this.#cache.get(cacheKey)) || null;
    if (cacheValue) return clone(cacheValue);
    // Router will return 403 when content exists but not assigned to this prison
    const lookupResult = await this.#throwNotFoundWhenStatusIs(
      [403, 404],
      async () => {
        const data = await this.jsonApiClient.getRelative(
          `/router/prison/${establishmentName}/translate-path?path=${lookupType}/${id}`,
        );
        const {
          jsonapi: { resourceName: type, individual: location },
          entity: { uuid },
        } = data;
        return { type, location, uuid };
      },
    );
    await this.#cache.set(cacheKey, lookupResult, 86400);
    return clone(lookupResult);
  };

  async lookupContent(establishmentName, contentId) {
    return this.#lookup(establishmentName, 'content', contentId);
  }

  async lookupTag(establishmentName, tagId) {
    return this.#lookup(establishmentName, 'tags', tagId);
  }

  async lookupLink(establishmentName, tagId) {
    return this.#lookup(establishmentName, 'link', tagId);
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

  async getCache(query) {
    const key = query.getKey?.() || null;
    const expiry = query.getExpiry?.() || 8640;
    let data = key ? await this.#cache.get(key) : null;
    if (!data) {
      data = (await this.get(query)) || [];
      if (key && expiry && data) await this.#cache.set(key, data, expiry);
    }
    // move to "structuredClone" when on node 18+
    return clone(data);
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
