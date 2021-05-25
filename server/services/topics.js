class TopicsService {
  #cmsApi;

  constructor(cmsApi) {
    this.#cmsApi = cmsApi;
  }

  async getTopics(prisonId) {
    return this.#cmsApi.getTopics(prisonId);
  }
}

module.exports = {
  TopicsService,
};
