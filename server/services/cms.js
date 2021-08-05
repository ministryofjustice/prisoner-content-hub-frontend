const { TopicsQuery } = require('../repositories/cmsQueries/topicsQuery');
const { HomepageQuery } = require('../repositories/cmsQueries/homepageQuery');

class CmsService {
  #cmsApi;

  constructor(cmsApi) {
    this.#cmsApi = cmsApi;
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
