const caseInsensitive = new Intl.Collator('en', { caseFirst: 'lower' });

class TopicsService {
  #cmsApi;

  constructor(cmsApi) {
    this.#cmsApi = cmsApi;
  }

  async getTopics(prisonId) {
    const topics = await this.#cmsApi.getTopics(prisonId);
    return topics.sort((a, b) =>
      caseInsensitive.compare(a.linkText, b.linkText),
    );
  }
}

module.exports = {
  TopicsService,
};
