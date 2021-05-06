const caseInsensitive = new Intl.Collator('en', { caseFirst: 'lower' });

class TopicsService {
  constructor(hubMenuRepository, cmsApi) {
    this.hubMenuRepository = hubMenuRepository;
    this.cmsApi = cmsApi;
  }

  async getTopics(prisonId) {
    const [tags, primary] = await Promise.all([
      this.hubMenuRepository.tagsMenu(prisonId),
      this.cmsApi.primaryMenu(prisonId),
    ]);

    return tags
      .concat(primary)
      .sort((a, b) => caseInsensitive.compare(a.linkText, b.linkText));
  }
}

module.exports = {
  TopicsService,
};
