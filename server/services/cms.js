const { TopicsQuery } = require('../repositories/cmsQueries/topicsQuery');
const { HomepageQuery } = require('../repositories/cmsQueries/homepageQuery');
const { BasicPageQuery } = require('../repositories/cmsQueries/basicPageQuery');

class CmsService {
  #cmsApi;

  constructor(cmsApi) {
    this.#cmsApi = cmsApi;
  }

  // will need tests
  async getContent(contentId) {
    const { type, location } = await this.#cmsApi.lookupContent(contentId);

    switch (type) {
      case 'node--page':
        return this.#cmsApi.getSingle(new BasicPageQuery(location));
      /// ...other types go here
      default:
        // log unsupported type
        return null;
    }
  }

  async getTopics(prisonId) {
    return this.#cmsApi.get(new TopicsQuery(prisonId));
  }

  async getHomepage(prisonId) {
    const homepages = await this.#cmsApi.get(new HomepageQuery(prisonId));
    return homepages[0];
  }
}

module.exports = {
  CmsService,
};
