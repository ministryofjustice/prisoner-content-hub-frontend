const { TopicsQuery } = require('../repositories/cmsQueries/topicsQuery');

class TopicsService {
  #cmsApi;

  constructor(cmsApi) {
    this.#cmsApi = cmsApi;
  }

  async getTopics(prisonId) {
    return this.#cmsApi.get(new TopicsQuery(prisonId));
  }
}

module.exports = {
  TopicsService,
};
